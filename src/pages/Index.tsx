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
import backgroundHero from '@/assets/background-hero.png';

const Index = () => {
  return (
    <div className="min-h-screen relative">
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
      <WhatsAppButton />
      <SocialProofNotification />
    </div>
  );
};

export default Index;
