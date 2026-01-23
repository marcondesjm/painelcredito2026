import { Check } from 'lucide-react';

const BenefitItem = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full px-5 py-3">
      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
        <Check className="w-4 h-4 text-primary-foreground" />
      </div>
      <span className="text-foreground text-sm">{text}</span>
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
    <section className="py-20 px-4 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por que <span className="text-primary">escolher</span> o painel?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tudo que você precisa para usar a Lovable sem preocupações.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-4">
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
