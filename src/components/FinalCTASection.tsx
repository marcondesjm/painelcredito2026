import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const FinalCTASection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
          Pronto para ter <span className="text-primary">créditos infinitos</span>?
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 px-2">
          Junte-se aos usuários que já estão aproveitando a Lovable sem limites.
        </p>
        <Button variant="hero" size="xl" className="w-full sm:w-auto" onClick={() => navigate('/checkout')}>
          Comprar Agora
        </Button>
      </div>
    </section>
  );
};
