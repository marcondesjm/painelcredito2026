import { Monitor, LayoutGrid, Infinity } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export const FeaturesSection = () => {
  const features = [
    {
      icon: Monitor,
      title: "Interface Simples",
      description: "Painel intuitivo, sem complicações. Qualquer pessoa consegue usar."
    },
    {
      icon: LayoutGrid,
      title: "100% Automatizado",
      description: "O sistema faz todo o trabalho. Você só precisa clicar."
    },
    {
      icon: Infinity,
      title: "Créditos Ilimitados",
      description: "Gere quantos créditos precisar, sem limites ou restrições."
    }
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            O que é o <span className="text-primary">Painel</span>?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Uma ferramenta automatizada que gera créditos para sua conta Lovable de forma simples e rápida.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
