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
          <div className="fixed inset-0 -z-15 overflow-hidden pointer-events-none select-none">
            <div className="absolute inset-0 flex flex-wrap items-start justify-center gap-4 p-8 opacity-[0.04]">
              {Array.from({ length: 40 }).map((_, i) => (
                <span
                  key={i}
                  className="text-4xl md:text-6xl font-black text-white whitespace-nowrap"
                  style={{ transform: `rotate(-15deg)` }}
                >
                  {bgText.text}
                </span>
              ))}
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
      <ToolProgressBar
        enabled={settings.tool_progress.enabled}
        label={settings.tool_progress.label}
        percentage={settings.tool_progress.percentage}
      />
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
