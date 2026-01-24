import { Button } from '@/components/ui/button';
import { CountdownTimer } from './CountdownTimer';
import { TrustBadge } from './TrustBadge';
import { Zap, Shield, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import productPainel from '@/assets/product-painel.png';


export const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 overflow-hidden">
      
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Dashboard Mockup */}
          <div className="hidden lg:block relative">
            <div className="relative animate-float">
              <img
                src={productPainel}
                alt="Dashboard Painel Créditos"
                className="w-full max-w-lg xl:max-w-2xl mx-auto drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="text-center lg:text-left">
            {/* Main heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="text-foreground">Créditos Infinitos na Lovable. </span>
              <span className="text-gradient">Simples. Rápido. Automático.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
              Use nosso painel exclusivo e gere créditos ilimitados para seus projetos Lovable e revenda créditos.
            </p>

            {/* CTA Button */}
            <div className="mb-4 sm:mb-6">
              <Button 
                variant="hero" 
                size="xl" 
                className="w-full sm:w-auto min-w-[200px]"
                onClick={() => navigate('/checkout')}
              >
                Comprar Agora
              </Button>
            </div>

            {/* Limited offer badge */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                Oferta Limitada
              </span>
              
              {/* Price */}
              <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="text-lg sm:text-xl text-muted-foreground line-through">R$ 150,00</span>
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent">R$ 99,99</span>
              </div>
            </div>

            {/* Countdown */}
            <div className="flex justify-center lg:justify-start mb-6 sm:mb-8">
              <CountdownTimer />
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
              <TrustBadge icon={Zap} text="Entrega Automática" />
              <TrustBadge icon={Shield} text="Pagamento Seguro" />
              <TrustBadge icon={Headphones} text="Suporte Disponível" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
