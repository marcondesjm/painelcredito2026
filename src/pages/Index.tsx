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
import { useNavigate } from 'react-router-dom';
import backgroundHero from '@/assets/background-hero.png';

const exampleTiers: PricingTier[] = [
  {
    id: '1',
    name: 'Pacote Iniciante',
    credits: 1000,
    price_original: 50,
    price_current: 29.99,
    available: 50,
    sales: 127,
    checkout_link: '/checkout',
    highlight: false
  },
  {
    id: '2',
    name: 'Pacote Básico',
    credits: 5000,
    price_original: 150,
    price_current: 99.99,
    available: 30,
    sales: 243,
    checkout_link: '/checkout',
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
    checkout_link: '/checkout',
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
    checkout_link: '/checkout',
    highlight: false
  }
];

const Index = () => {
  const navigate = useNavigate();

  const handleBuyClick = (tier: PricingTier) => {
    navigate('/checkout', { state: { selectedTier: tier } });
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
        tiers={exampleTiers} 
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
      <WhatsAppButton number="5548996029392" message="Olá! Gostaria de mais informações sobre o painel." />
      <SocialProofNotification />
    </div>
  );
};

export default Index;
