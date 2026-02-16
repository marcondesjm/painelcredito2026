import { Button } from '@/components/ui/button';
import { CountdownTimer } from './CountdownTimer';
import { TrustBadge } from './TrustBadge';
import { Zap, Shield, Headphones, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import productPainel from '@/assets/product-painel.png';
import { useHomepageSettings } from '@/hooks/useHomepageSettings';
import { useLanguage } from '@/hooks/useLanguage';

export const HeroSection = () => {
  const navigate = useNavigate();
  const { settings } = useHomepageSettings();
  const { hero } = settings;
  const { t, language } = useLanguage();

  const BRL_TO_USD_RATE = 0.18;

  const formatPrice = (value: number) => {
    const displayValue = language === 'en' ? value * BRL_TO_USD_RATE : value;
    return new Intl.NumberFormat(language === 'pt' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: language === 'pt' ? 'BRL' : 'USD',
    }).format(displayValue);
  };

  const savings = hero.price_original > hero.price_current
    ? Math.round(((hero.price_original - hero.price_current) / hero.price_original) * 100)
    : null;
  
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="hidden lg:block relative">
            <div className="relative animate-float">
              <img src={productPainel} alt="Dashboard Painel Créditos" className="w-full max-w-lg xl:max-w-2xl mx-auto drop-shadow-2xl" />
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="text-foreground">{language === 'en' ? t('hero.title') : hero.title} </span>
              <span className="text-gradient">{language === 'en' ? t('hero.title_highlight') : hero.title_highlight}</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
              {(() => {
                const text = language === 'en' ? t('hero.subtitle') : hero.subtitle;
                const parts = text.split(/\n+/);
                return parts[0];
              })()}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap justify-center lg:justify-start">
                <span className="text-lg sm:text-xl text-muted-foreground line-through">
                  {formatPrice(hero.price_original)}
                </span>
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent">
                  {formatPrice(hero.price_current)}
                </span>
                {savings && (
                  <span className="bg-accent/20 text-accent text-xs font-bold px-2 py-1 rounded">
                    {t('hero.savings')} {savings}%
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <Button variant="hero" size="xl" className="w-full sm:w-auto min-w-[200px]" onClick={() => navigate('/checkout')}>
                {language === 'en' ? t('hero.cta_text') : hero.cta_text}
              </Button>
            </div>


            <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 mb-4">
              <TrustBadge icon={Zap} text={t('hero.auto_delivery')} />
              <TrustBadge icon={Shield} text={t('hero.secure_payment')} />
              <TrustBadge icon={Headphones} text={t('hero.support_available')} />
            </div>

            <div className="flex justify-center lg:justify-start mb-4">
              <CountdownTimer />
            </div>

            {(() => {
              const text = language === 'en' ? t('hero.subtitle') : hero.subtitle;
              const parts = text.split(/\n+/);
              if (parts.length > 1) {
                return (
                  <div className="text-center lg:text-left">
                    <span 
                      className="text-primary font-bold text-lg sm:text-xl inline-flex items-center gap-2 drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)] cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => document.getElementById('pacotes')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      {parts.slice(1).join(' ')}
                    </span>
                    <ChevronDown 
                      className="w-10 h-10 text-primary animate-bounce cursor-pointer hover:opacity-80 transition-opacity mx-auto lg:mx-0 mt-2 drop-shadow-[0_0_12px_hsl(var(--primary)/0.6)]" 
                      onClick={() => document.getElementById('pacotes')?.scrollIntoView({ behavior: 'smooth' })}
                    />
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>
      </div>
    </section>
  );
};
