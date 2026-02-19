import { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { WhyChooseSection } from '@/components/WhyChooseSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { VideoSection } from '@/components/VideoSection';
import { SecurePurchaseSection } from '@/components/SecurePurchaseSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { GuaranteeSection } from '@/components/GuaranteeSection';
import { StatsSection } from '@/components/StatsSection';
import { FAQSection } from '@/components/FAQSection';
import { FinalCTASection } from '@/components/FinalCTASection';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { SocialProofNotification } from '@/components/SocialProofNotification';
import { PricingTiersSection, PricingTier } from '@/components/PricingTiersSection';
import { RechargeInfoSection } from '@/components/RechargeInfoSection';
import { CheckoutModal } from '@/components/CheckoutModal';
import backgroundHeroDefault from '@/assets/background-hero.png';
import { useHomepageSettings } from '@/hooks/useHomepageSettings';
import { TrackingScripts } from '@/components/TrackingScripts';
import { ToolProgressBar } from '@/components/ToolProgressBar';

// Fallback tiers when database is loading or empty
const fallbackTiers: PricingTier[] = [
  {
    id: '1',
    name: 'Pacote Iniciante',
    credits: 1000,
    price_original: 50,
    price_current: 29.99,
    available: 50,
    sales: 127,
    checkout_link: '',
    highlight: false
  },
  {
    id: '2',
    name: 'Pacote Básico',
    credits: 5000,
    price_original: 600,
    price_current: 349.99,
    available: 30,
    sales: 243,
    checkout_link: '',
    highlight: true
  },
  {
    id: '3',
    name: 'Pacote Profissional',
    credits: 10000,
    price_original: 280,
    price_current: 179.99,
    available: 20,
    sales: 89,
    checkout_link: '',
    highlight: false
  },
  {
    id: '4',
    name: 'Pacote Empresarial',
    credits: 50000,
    price_original: 1200,
    price_current: 799.99,
    available: 10,
    sales: 34,
    checkout_link: '',
    highlight: false
  }
];

const Index = () => {
  const { settings, loading } = useHomepageSettings();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);

  // Use database tiers if available, otherwise fallback
  const tiers = settings.pricing_tiers.length > 0 ? settings.pricing_tiers : fallbackTiers;

  const handleBuyClick = (tier: PricingTier) => {
    setSelectedTier(tier);
    setCheckoutOpen(true);
  };

  const vis = settings.sections_visibility;
  const bgImage = settings.background_url || backgroundHeroDefault;
  const overlayOpacity = settings.background_overlay / 100;
  const bgText = settings.background_text;

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <TrackingScripts />
      {/* Fixed background */}
      {bgText.enabled ? (
        <>
          <div
            className="fixed inset-0 -z-20"
            style={{
              background: `linear-gradient(135deg, ${bgText.gradient_from}, ${bgText.gradient_to})`,
            }}
          />
          <div className="fixed inset-0 -z-15 overflow-hidden pointer-events-none select-none flex items-center justify-center">
            <div className="text-center px-8 opacity-[0.06]">
              <p
                className="font-black text-white leading-relaxed whitespace-pre-line"
                style={{
                  fontFamily: bgText.font_family || 'Inter',
                  fontSize: { xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem', '5xl': '3rem', '6xl': '3.75rem' }[bgText.font_size || '4xl'] || '2.25rem',
                }}
              >
                {bgText.text}
              </p>
              {settings.tool_progress.enabled && (
                <div className="mt-6 flex items-center justify-center gap-3 pointer-events-auto opacity-100" style={{ opacity: 1 }}>
                  <span className="text-sm font-semibold text-white/60 whitespace-nowrap">
                    {settings.tool_progress.label}
                  </span>
                  <div className="w-48 h-3 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                      style={{ width: `${Math.min(100, Math.max(0, settings.tool_progress.percentage))}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-primary whitespace-nowrap">
                    {settings.tool_progress.percentage}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div
          className="fixed inset-0 -z-20"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'contain',
            backgroundPosition: 'top center',
            backgroundRepeat: 'repeat',
          }}
        />
      )}
      {/* Dark overlay - controlled from admin panel */}
      {overlayOpacity > 0 && (
        <div className="fixed inset-0 -z-10" style={{ backgroundColor: `hsl(240 10% 4% / ${overlayOpacity})` }} />
      )}
      {!bgText.enabled && (
        <ToolProgressBar
          enabled={settings.tool_progress.enabled}
          label={settings.tool_progress.label}
          percentage={settings.tool_progress.percentage}
        />
      )}
      <Header />
      {vis.hero && <HeroSection />}
      {vis.pricing && (
        <div id="pacotes">
          <PricingTiersSection 
            tiers={tiers} 
            customPackageOptions={settings.custom_package_options}
            primaryColor="#8B5CF6" 
            accentColor="#22C55E"
            onBuyClick={handleBuyClick}
          />
          <RechargeInfoSection />
        </div>
      )}
      {vis.features && <FeaturesSection />}
      {vis.why_choose && <WhyChooseSection />}
      {vis.how_it_works && <HowItWorksSection />}
      {vis.video && <VideoSection />}
      {vis.secure_purchase && <SecurePurchaseSection />}
      {vis.testimonials && <TestimonialsSection />}
      {vis.guarantee && <GuaranteeSection title={settings.guarantee.title} items={settings.guarantee.items} />}
      {vis.stats && <StatsSection />}
      {vis.faq && <FAQSection title={settings.faq.title} subtitle={settings.faq.subtitle} items={settings.faq.items} />}
      {vis.final_cta && <FinalCTASection />}
      <Footer />
      <WhatsAppButton number={settings.whatsapp_number || '5548996029392'} message="Olá! Gostaria de mais informações sobre o painel." />
      <SocialProofNotification 
        enabled={settings.social_proof.enabled}
        productName={settings.social_proof.product_name}
        customers={settings.social_proof.customers}
        creditOptions={settings.social_proof.credit_options}
      />
      
      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        tier={selectedTier}
        landingPageId="homepage"
        primaryColor="#8B5CF6"
        accentColor="#22C55E"
        pixEnabled={true}
        pixKey={settings.pix_key || ''}
        pixName={settings.pix_name || ''}
        whatsappNumber={settings.whatsapp_number || '5548996029392'}
        showBalance={true}
      />
    </div>
  );
};

export default Index;
