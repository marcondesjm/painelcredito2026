import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const FinalCTASection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Pronto para ter <span className="text-primary">créditos infinitos</span>?
        </h2>
        <p className="text-muted-foreground mb-8">
          Junte-se aos usuários que já estão aproveitando a Lovable sem limites.
        </p>
        <Button variant="hero" size="xl" onClick={() => navigate('/checkout')}>
          Comprar Agora
        </Button>
      </div>
    </section>
  );
};
