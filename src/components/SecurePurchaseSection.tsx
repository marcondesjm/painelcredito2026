import { Shield, Zap, Headphones, RefreshCw } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface TrustItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const TrustItem = ({ icon: Icon, title, description }: TrustItemProps) => {
  return (
    <div className="flex items-start gap-3 sm:gap-4">
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
      </div>
      <div>
        <h3 className="text-sm sm:text-base font-semibold text-foreground mb-0.5 sm:mb-1">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export const SecurePurchaseSection = () => {
  const trustItems: TrustItemProps[] = [
    {
      icon: Shield,
      title: "Produto Testado",
      description: "Ferramenta validada e funcionando perfeitamente."
    },
    {
      icon: Zap,
      title: "Entrega Automática",
      description: "Receba acesso imediato após a confirmação do pagamento."
    },
    {
      icon: Headphones,
      title: "Suporte Disponível",
      description: "Equipe pronta para ajudar sempre que precisar."
    },
    {
      icon: RefreshCw,
      title: "Atualizações Gratuitas",
      description: "Melhorias constantes sem custo adicional."
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Compra <span className="text-primary">Segura</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Sua confiança é nossa prioridade.
          </p>
        </div>

        {/* Trust Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {trustItems.map((item, index) => (
            <TrustItem
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
