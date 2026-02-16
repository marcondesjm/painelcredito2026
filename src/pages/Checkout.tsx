import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Shield, Zap, Headphones, Check, Mail, Lock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import productPainel from '@/assets/product-painel.png';
import { PricingTier } from '@/components/PricingTiersSection';
import { useHomepageSettings } from '@/hooks/useHomepageSettings';
import { useLanguage } from '@/hooks/useLanguage';

const USD_RATE = 0.18;

const Checkout = () => {
  const location = useLocation();
  const { settings } = useHomepageSettings();
  const { language, t } = useLanguage();

  const isEN = language === 'en';

  // Default tier when accessing /checkout directly (without selecting a package)
  const defaultTier: PricingTier = {
    id: 'default',
    name: isEN ? 'Credits Generator Panel' : 'Painel Gerador de Créditos',
    credits: 5000,
    price_original: settings.hero.price_original,
    price_current: settings.hero.price_current,
    available: 30,
    sales: 243,
    checkout_link: '',
    highlight: false
  };

  const selectedTier = (location.state as { selectedTier?: PricingTier })?.selectedTier || defaultTier;
  const { checkout } = settings;
  
  const [email, setEmail] = useState('');

  const convertPrice = (value: number) => isEN ? value * USD_RATE : value;

  const formatPrice = (value: number) => {
    const converted = convertPrice(value);
    return new Intl.NumberFormat(isEN ? 'en-US' : 'pt-BR', {
      style: 'currency',
      currency: isEN ? 'USD' : 'BRL',
    }).format(converted);
  };

  const calculateSavings = () => {
    if (!selectedTier.price_original || selectedTier.price_original <= selectedTier.price_current) {
      return null;
    }
    return Math.round(((selectedTier.price_original - selectedTier.price_current) / selectedTier.price_original) * 100);
  };

  const savings = calculateSavings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = encodeURIComponent(
      `Olá! Gostaria de comprar o ${selectedTier.name} (${selectedTier.credits.toLocaleString(isEN ? 'en-US' : 'pt-BR')} créditos) por ${formatPrice(selectedTier.price_current)}. Meu email: ${email}`
    );
    window.open(`https://wa.me/${settings.whatsapp_number || '5548996029392'}?text=${whatsappMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30 bg-background/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('checkout.back')}
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Info */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
            <div className="flex gap-4 mb-6">
              <img 
                src={productPainel} 
                alt="Painel Gerador" 
                className="w-40 h-28 object-cover rounded-xl border border-border/50"
              />
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {selectedTier.name}
                </h1>
                <p className="text-lg font-semibold text-foreground">{isEN ? t('checkout.full_access') : checkout.product_subtitle}</p>
                <p className="text-sm text-muted-foreground">{isEN ? t('checkout.lifetime_access') : checkout.product_description}</p>
                
                <div className="flex items-center gap-2 mt-3 mb-1">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {isEN ? t('checkout.limited_offer') : checkout.badge_text}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedTier.price_original && selectedTier.price_original > selectedTier.price_current && (
                    <span className="text-muted-foreground line-through text-sm">
                      {formatPrice(selectedTier.price_original)}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-accent">
                    {formatPrice(selectedTier.price_current)}
                  </span>
                  {savings && (
                    <span className="bg-accent/20 text-accent text-xs px-2 py-0.5 rounded-full">
                      {t('checkout.savings')} {savings}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-primary" />
                {t('checkout.secure_purchase')}
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-primary" />
                {t('checkout.auto_delivery')}
              </div>
              <div className="flex items-center gap-1">
                <Headphones className="w-4 h-4 text-primary" />
                {t('checkout.support_24h')}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">{t('checkout.what_you_get')}</h3>
              <ul className="space-y-2">
                {(isEN
                  ? ['Lifetime Panel Access', 'Unlimited Credit Generator', 'Premium 24/7 Support', 'Free Updates', 'Exclusive Community']
                  : checkout.benefits
                ).map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-accent" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {t('checkout.your_email')}
                </label>
                <Input
                  type="email"
                  placeholder={t('checkout.email_placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background border-border"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {t('checkout.email_hint')}
                </p>
              </div>

              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-background/50 p-3 rounded-lg">
                <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{t('checkout.data_protected')}</span>
              </div>

              <Button type="submit" variant="hero" size="xl" className="w-full">
                {isEN ? t('checkout.buy_now') : checkout.button_text}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {t('checkout.already_customer')}{' '}
                <Link to="/" className="text-primary hover:underline">
                  {t('checkout.click_here')}
                </Link>
              </p>

              <p className="text-center text-xs text-muted-foreground">
                {t('checkout.agree_terms')}{' '}
                <Link to="/termos" className="text-primary hover:underline">{t('checkout.terms')}</Link>
                {' '}{t('checkout.and')}{' '}
                <Link to="/privacidade" className="text-primary hover:underline">{t('checkout.privacy')}</Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
