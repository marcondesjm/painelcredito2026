import { ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export type SectionId = 'hero' | 'features' | 'about' | 'how-it-works' | 'testimonials' | 'faq' | 'cta' | 'donation';

interface SectionOrderManagerProps {
  sectionOrder: SectionId[];
  onOrderChange: (newOrder: SectionId[]) => void;
}

const sectionLabels: Record<SectionId, string> = {
  'hero': '🏠 Hero (Topo)',
  'features': '✨ Funcionalidades',
  'about': '📝 Sobre',
  'how-it-works': '🔧 Como Funciona',
  'testimonials': '💬 Depoimentos',
  'faq': '❓ Perguntas Frequentes',
  'cta': '🎯 CTA Final',
  'donation': '💚 Doação',
};

export const defaultSectionOrder: SectionId[] = [
  'hero',
  'features',
  'about',
  'how-it-works',
  'testimonials',
  'faq',
  'cta',
  'donation',
];

export const SectionOrderManager = ({ sectionOrder, onOrderChange }: SectionOrderManagerProps) => {
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    
    // Swap sections
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    onOrderChange(newOrder);
  };

  return (
    <Card className="bg-card/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Ordem das Seções</CardTitle>
        <CardDescription>Reorganize a ordem das seções na página</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {sectionOrder.map((sectionId, index) => (
          <div
            key={sectionId}
            className="flex items-center gap-2 p-3 bg-background/50 rounded-lg border border-border/50 group hover:border-primary/50 transition-colors"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
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
                disabled={index === sectionOrder.length - 1}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
