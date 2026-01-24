import { Check } from 'lucide-react';

const BenefitItem = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full px-3 sm:px-5 py-2 sm:py-3">
      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
      </div>
      <span className="text-foreground text-xs sm:text-sm">{text}</span>
    </div>
  );
};

export const WhyChooseSection = () => {
  const benefits = [
    { left: "Créditos ilimitados para seus projetos", right: "Interface simples e intuitiva" },
    { left: "Uso imediato após a compra", right: "Não exige conhecimento técnico" },
    { left: "Ideal para quem usa Lovable com frequência", right: "Funciona 24 horas por dia" },
    { left: "Atualizações gratuitas incluídas", right: "Suporte via chat disponível" },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Por que <span className="text-primary">escolher</span> o painel?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-2">
            Tudo que você precisa para usar a Lovable sem preocupações.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {benefits.map((row, index) => (
            <div key={index} className="contents">
              <BenefitItem text={row.left} />
              <BenefitItem text={row.right} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
