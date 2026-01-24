import { CreditCard, LogIn, Sparkles, Rocket } from 'lucide-react';

const StepCard = ({ 
  number, 
  icon: Icon, 
  title, 
  description,
  isFirst 
}: { 
  number: string; 
  icon: any; 
  title: string; 
  description: string;
  isFirst?: boolean;
}) => {
  return (
    <div className={`relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 ${isFirst ? 'border-primary/50' : ''}`}>
      {/* Step number */}
      <span className="text-2xl sm:text-4xl font-bold text-primary/30 mb-2 sm:mb-4 block">{number}</span>
      
      {/* Icon */}
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
      </div>
      
      {/* Content */}
      <h3 className="text-sm sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      icon: CreditCard,
      title: "Compre o Acesso",
      description: "Pagamento rápido e seguro. Acesso liberado na hora."
    },
    {
      number: "02",
      icon: LogIn,
      title: "Entre no Painel",
      description: "Receba suas credenciais e acesse a plataforma."
    },
    {
      number: "03",
      icon: Sparkles,
      title: "Gere Créditos",
      description: "Com poucos cliques, seus créditos são gerados automaticamente."
    },
    {
      number: "04",
      icon: Rocket,
      title: "Use na Lovable",
      description: "Aproveite seus créditos e crie projetos sem limites."
    }
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Como <span className="text-primary">funciona</span>?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Processo simples em 4 passos.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              number={step.number}
              icon={step.icon}
              title={step.title}
              description={step.description}
              isFirst={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
