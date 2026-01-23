import { Shield, Zap, Headphones, RefreshCw } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface TrustItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const TrustItem = ({ icon: Icon, title, description }: TrustItemProps) => {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
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
    <section className="py-20 px-4 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Compra <span className="text-primary">Segura</span>
          </h2>
          <p className="text-muted-foreground">
            Sua confiança é nossa prioridade.
          </p>
        </div>

        {/* Trust Items Grid */}
        <div className="grid sm:grid-cols-2 gap-8">
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
