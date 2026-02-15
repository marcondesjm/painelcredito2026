import { CheckCircle } from 'lucide-react';

const defaultGuaranteeItems = [
  "Garantimos a entrega e funcionamento do produto no momento da liberação.",
  "Caso ocorra reset de créditos e a plataforma ainda permita novas adições, realizamos a reposição por até 15 dias após a recarga.",
  "O prazo de 15 dias refere-se à garantia de entrega e funcionamento inicial.",
];

interface GuaranteeSectionProps {
  title?: string;
  items?: string[];
}

export const GuaranteeSection = ({ title, items }: GuaranteeSectionProps) => {
  const displayTitle = title || 'Garantia';
  const displayItems = items && items.length > 0 ? items : defaultGuaranteeItems;

  return (
    <section className="py-10 sm:py-14 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-foreground">{displayTitle}</h3>
          </div>
          <ul className="space-y-3">
            {displayItems.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                <span className="mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
