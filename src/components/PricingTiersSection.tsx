import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Check, TrendingUp, Sparkles, MessageCircle, Package } from 'lucide-react';

interface CustomPackageCardProps {
  primaryColor: string;
  accentColor: string;
  onBuyClick: (tier: PricingTier) => void;
}

const CustomPackageCard = ({ primaryColor, accentColor, onBuyClick }: CustomPackageCardProps) => {
  const [credits, setCredits] = useState('');
  
  const creditValue = parseInt(credits) || 0;
  const pricePerCredit = 0.07;
  const totalPrice = creditValue * pricePerCredit;

  const handleSubmit = () => {
    if (creditValue < 100) return;
    const customTier: PricingTier = {
      id: 'custom',
      name: 'Pacote Personalizado',
      credits: creditValue,
      price_original: totalPrice * 1.5,
      price_current: totalPrice,
      available: 1,
      sales: 0,
      checkout_link: '',
      highlight: false,
    };
    onBuyClick(customTier);
  };

  return (
    <Card className="relative overflow-hidden border border-dashed border-border/80 hover:scale-[1.02] hover:shadow-xl transition-all duration-500 group">
      <div 
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 100%, ${primaryColor}60 0%, transparent 70%)`
        }}
      />
      <div className="p-5 relative z-10 flex flex-col h-full">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-5 h-5" style={{ color: primaryColor }} />
            <h3 className="font-bold text-lg leading-tight">Personalizado</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Monte seu próprio pacote
          </p>
        </div>

        <div className="mb-4 flex-1">
          <label className="text-xs text-muted-foreground mb-1.5 block">Quantos créditos?</label>
          <Input
            type="number"
            placeholder="Ex: 3000"
            min={100}
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            className="bg-secondary/50 border-border/50"
          />
          {creditValue >= 100 && (
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Créditos</span>
                <span className="font-medium text-foreground">{formatCredits(creditValue)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Valor</span>
                <span className="font-bold text-lg" style={{ color: accentColor }}>
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          )}
          {credits !== '' && creditValue < 100 && (
            <p className="text-xs text-destructive mt-1">Mínimo de 100 créditos</p>
          )}
        </div>

        <Button
          className="w-full text-white font-semibold hover:scale-105 transition-all duration-300 flex items-center gap-2"
          style={{ backgroundColor: primaryColor }}
          onClick={handleSubmit}
          disabled={creditValue < 100}
        >
          <MessageCircle className="w-4 h-4" />
          Solicitar Orçamento
        </Button>
      </div>
    </Card>
  );
};

export interface PricingTier {
  id: string;
  name: string;
  credits: number;
  price_original: number;
  price_current: number;
  available: number;
  sales: number;
  checkout_link: string;
  highlight?: boolean;
}

interface PricingTiersSectionProps {
  tiers: PricingTier[];
  primaryColor?: string;
  accentColor?: string;
  isPreview?: boolean;
  onTierClick?: (tier: PricingTier) => void;
  onBuyClick?: (tier: PricingTier) => void;
}

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatCredits = (credits: number) => {
  if (credits >= 1000) {
    return `${(credits / 1000).toFixed(0)}k`;
  }
  return credits.toString();
};

export const PricingTiersSection = ({
  tiers,
  primaryColor = '#8B5CF6',
  accentColor = '#22C55E',
  isPreview = false,
  onTierClick,
  onBuyClick
}: PricingTiersSectionProps) => {
  const handleTierSelect = (tier: PricingTier) => {
    if (isPreview) {
      onTierClick?.(tier);
      return;
    }
    
    // If onBuyClick is provided, use it (opens checkout modal)
    if (onBuyClick) {
      onBuyClick(tier);
      return;
    }
    
    // Fallback to external checkout link
    if (tier.checkout_link) {
      if (tier.checkout_link.startsWith('http://') || tier.checkout_link.startsWith('https://')) {
        window.open(tier.checkout_link, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = tier.checkout_link;
      }
    }
  };

  if (!tiers || tiers.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .highlight-card {
          animation: float 3s ease-in-out infinite;
        }
        .shimmer-badge {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.4) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        .glow-effect::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(135deg, var(--glow-color), transparent, var(--glow-color));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            Escolha seu <span style={{ color: primaryColor }}>Pacote de Créditos</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Selecione a quantidade de créditos ideal para você. Quanto mais créditos, maior a economia!
          </p>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${tiers.length >= 4 ? 'lg:grid-cols-4 xl:grid-cols-5' : `lg:grid-cols-${tiers.length + 1}`} gap-4 md:gap-6`}>
          {tiers.map((tier) => {
            const savings = tier.price_original - tier.price_current;
            
            return (
              <Card
                key={tier.id}
                className={`relative overflow-hidden transition-all duration-500 group ${
                  tier.highlight 
                    ? 'highlight-card border-2 ring-2 ring-offset-2 ring-offset-background hover:scale-[1.05] glow-effect' 
                    : 'border border-border/50 hover:scale-[1.02] hover:shadow-xl'
                }`}
                style={{
                  borderColor: tier.highlight ? primaryColor : undefined,
                  boxShadow: tier.highlight ? `0 0 40px ${primaryColor}40, 0 0 80px ${primaryColor}20` : undefined,
                  '--glow-color': primaryColor,
                } as React.CSSProperties}
              >
                {/* Animated background gradient for highlighted cards */}
                {tier.highlight && (
                  <div 
                    className="absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${primaryColor}60 0%, transparent 70%)`
                    }}
                  />
                )}
                
                {tier.highlight && (
                  <div 
                    className="absolute top-0 left-0 right-0 py-1.5 text-center text-xs font-bold text-white overflow-hidden"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <div className="absolute inset-0 shimmer-badge" />
                    <span className="relative z-10 flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      MAIS POPULAR
                      <Sparkles className="w-3 h-3 animate-pulse" />
                    </span>
                  </div>
                )}
                
                <div className={`p-5 relative z-10 ${tier.highlight ? 'pt-10' : ''}`}>
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className={`font-bold text-lg leading-tight mb-1 transition-colors duration-300 ${
                      tier.highlight ? 'group-hover:text-white' : ''
                    }`}>
                      {formatCredits(tier.credits)} de créditos
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {tier.name}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="text-xs text-muted-foreground mb-1">Preço oficial</div>
                    <div className="text-sm text-muted-foreground line-through">
                      {formatPrice(tier.price_original)}
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-2 mb-1">Nosso preço</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span 
                        className={`text-2xl font-bold transition-all duration-300 ${
                          tier.highlight ? 'group-hover:scale-110' : ''
                        }`}
                        style={{ color: accentColor }}
                      >
                        {formatPrice(tier.price_current)}
                      </span>
                      {tier.available > 0 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs transition-all duration-300 group-hover:scale-105"
                          style={{ 
                            borderColor: accentColor,
                            color: accentColor 
                          }}
                        >
                          {tier.available} disp.
                        </Badge>
                      )}
                    </div>
                    
                    <div 
                      className="text-sm font-medium mt-2"
                      style={{ color: accentColor }}
                    >
                      Economia de {formatPrice(savings)}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    {tier.sales > 0 && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +{tier.sales} vendas
                      </div>
                    )}
                    {tier.available > 0 && (
                      <div className="flex items-center gap-1">
                        <Check className="w-3 h-3" style={{ color: accentColor }} />
                        Disponível
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={`w-full text-white font-semibold transition-all duration-300 ${
                      tier.highlight 
                        ? 'group-hover:scale-105 group-hover:shadow-lg' 
                        : 'hover:scale-105'
                    }`}
                    style={{ 
                      backgroundColor: tier.highlight ? primaryColor : accentColor,
                      boxShadow: tier.highlight ? `0 4px 20px ${primaryColor}50` : undefined
                    }}
                    onClick={() => handleTierSelect(tier)}
                  >
                    Comprar Agora
                  </Button>
                </div>
              </Card>
            );
          })}

          {/* Custom Package Card */}
          {onBuyClick && !isPreview && (
            <CustomPackageCard 
              primaryColor={primaryColor} 
              accentColor={accentColor} 
              onBuyClick={onBuyClick} 
            />
          )}
        </div>
      </div>
    </section>
  );
};
