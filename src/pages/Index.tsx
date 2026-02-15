import { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { WhyChooseSection } from '@/components/WhyChooseSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { VideoSection } from '@/components/VideoSection';
import { SecurePurchaseSection } from '@/components/SecurePurchaseSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { StatsSection } from '@/components/StatsSection';
import { FAQSection } from '@/components/FAQSection';
import { FinalCTASection } from '@/components/FinalCTASection';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { SocialProofNotification } from '@/components/SocialProofNotification';
import { PricingTiersSection, PricingTier } from '@/components/PricingTiersSection';
import { CheckoutModal } from '@/components/CheckoutModal';
import backgroundHero from '@/assets/background-hero.png';
import { useHomepageSettings } from '@/hooks/useHomepageSettings';

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

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Fixed background for entire page */}
      <div 
        className="fixed inset-0 -z-20"
        style={{ 
          backgroundImage: `url(${backgroundHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-[hsl(240,10%,4%)]/70 -z-10" />
      <Header />
      <HeroSection />
      <PricingTiersSection 
        tiers={tiers} 
        customPackageOptions={settings.custom_package_options}
        primaryColor="#8B5CF6" 
        accentColor="#22C55E"
        onBuyClick={handleBuyClick}
      />
      <FeaturesSection />
      <WhyChooseSection />
      <HowItWorksSection />
      <VideoSection />
      <SecurePurchaseSection />
      <TestimonialsSection />
      <StatsSection />
      <FAQSection />
      <FinalCTASection />
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
