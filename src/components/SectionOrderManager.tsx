import { forwardRef, useState, useRef } from 'react';
import { ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export type SectionId = 'hero' | 'video' | 'features' | 'about' | 'how-it-works' | 'secure-purchase' | 'testimonials' | 'faq' | 'cta' | 'donation' | 'pacotes' | 'recharge-info' | 'why-choose' | 'checkout';

interface SectionOrderManagerProps {
  sectionOrder: SectionId[];
  onOrderChange: (newOrder: SectionId[]) => void;
}

const sectionLabels: Record<SectionId, string> = {
  'hero': '🏠 Hero (Topo)',
  'video': '🎬 Vídeo',
  'pacotes': '💰 Pacotes de Créditos',
  'recharge-info': '⚡ Recarga Rápida',
  'features': '✨ Funcionalidades',
  'why-choose': '✅ Por que Escolher',
  'about': '📝 Sobre',
  'how-it-works': '🔧 Como Funciona',
  'secure-purchase': '🛡️ Compra Segura',
  'testimonials': '💬 Depoimentos',
  'faq': '❓ Perguntas Frequentes',
  'cta': '🎯 CTA Final',
  'donation': '💚 Doação',
  'checkout': '🛒 Checkout',
};

export const defaultSectionOrder: SectionId[] = [
  'hero',
  'video',
  'pacotes',
  'recharge-info',
  'features',
  'why-choose',
  'about',
  'how-it-works',
  'secure-purchase',
  'testimonials',
  'faq',
  'cta',
  'donation',
];

const hiddenFromManager: SectionId[] = ['checkout'];

export const SectionOrderManager = forwardRef<HTMLDivElement, SectionOrderManagerProps>(
  ({ sectionOrder, onOrderChange }, ref) => {
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);
    const dragNode = useRef<HTMLDivElement | null>(null);

    const visibleSections = sectionOrder.filter(id => !hiddenFromManager.includes(id));

    const moveSection = (index: number, direction: 'up' | 'down') => {
      const newOrder = [...sectionOrder];
      const visibleId = visibleSections[index];
      const realIndex = newOrder.indexOf(visibleId);
      
      // Find the next/prev visible item's real index
      const targetVisibleIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetVisibleIndex < 0 || targetVisibleIndex >= visibleSections.length) return;
      
      const targetId = visibleSections[targetVisibleIndex];
      const targetRealIndex = newOrder.indexOf(targetId);
      
      [newOrder[realIndex], newOrder[targetRealIndex]] = [newOrder[targetRealIndex], newOrder[realIndex]];
      onOrderChange(newOrder);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
      setDragIndex(index);
      dragNode.current = e.currentTarget;
      e.dataTransfer.effectAllowed = 'move';
      // Make drag image semi-transparent
      setTimeout(() => {
        if (dragNode.current) {
          dragNode.current.style.opacity = '0.4';
        }
      }, 0);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (dragIndex === null || dragIndex === index) return;
      setOverIndex(index);
    };

    const handleDragEnd = () => {
      if (dragNode.current) {
        dragNode.current.style.opacity = '1';
      }
      
      if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
        const newVisible = [...visibleSections];
        const [moved] = newVisible.splice(dragIndex, 1);
        newVisible.splice(overIndex, 0, moved);
        
        // Rebuild full order: hidden items stay in place, visible items get new order
        const hiddenItems = sectionOrder.filter(id => hiddenFromManager.includes(id));
        onOrderChange([...newVisible, ...hiddenItems]);
      }
      
      setDragIndex(null);
      setOverIndex(null);
      dragNode.current = null;
    };

    const handleDragLeave = () => {
      setOverIndex(null);
    };

    // Touch drag support
    const touchStartY = useRef<number>(0);
    const touchDragIndex = useRef<number | null>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleTouchStart = (index: number, e: React.TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchDragIndex.current = index;
      setDragIndex(index);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (touchDragIndex.current === null) return;
      e.preventDefault();
      const touchY = e.touches[0].clientY;

      // Find which item we're over
      for (let i = 0; i < itemRefs.current.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (touchY >= rect.top && touchY <= rect.bottom) {
          if (i !== touchDragIndex.current) {
            setOverIndex(i);
          }
          break;
        }
      }
    };

    const handleTouchEnd = () => {
      if (touchDragIndex.current !== null && overIndex !== null && touchDragIndex.current !== overIndex) {
        const newVisible = [...visibleSections];
        const [moved] = newVisible.splice(touchDragIndex.current, 1);
        newVisible.splice(overIndex, 0, moved);
        
        const hiddenItems = sectionOrder.filter(id => hiddenFromManager.includes(id));
        onOrderChange([...newVisible, ...hiddenItems]);
      }
      
      setDragIndex(null);
      setOverIndex(null);
      touchDragIndex.current = null;
    };

    return (
      <Card ref={ref} className="bg-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Ordem das Seções</CardTitle>
          <CardDescription>Arraste ou use as setas para reorganizar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {visibleSections.map((sectionId, index) => (
            <div
              key={sectionId}
              ref={el => { itemRefs.current[index] = el; }}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onDragLeave={handleDragLeave}
              onTouchStart={(e) => handleTouchStart(index, e)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`flex items-center gap-2 p-3 bg-background/50 rounded-lg border transition-all cursor-grab active:cursor-grabbing select-none ${
                overIndex === index && dragIndex !== null
                  ? 'border-primary ring-1 ring-primary/30 scale-[1.02]'
                  : dragIndex === index
                  ? 'border-primary/50 opacity-50'
                  : 'border-border/50 hover:border-primary/50'
              }`}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="flex-1 text-sm font-medium">
                {sectionLabels[sectionId] || sectionId}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => moveSection(index, 'up')}
                  disabled={index === 0}
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => moveSection(index, 'down')}
                  disabled={index === visibleSections.length - 1}
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
);

SectionOrderManager.displayName = 'SectionOrderManager';
