import { Star, Clock, ThumbsUp, Zap } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    email: "mn***@gmail.com",
    timeAgo: "há 2h",
    credits: 50,
    text: "Experiência incrível, recarrega de forma rápida os créditos. Parabéns a equipe que desenvolveu o Lovable Credits :)",
  },
  {
    id: 2,
    email: "ad***@leieimici.online",
    timeAgo: "há 3h",
    credits: 30,
    text: "Isso aqui é surreal de bom",
  },
  {
    id: 3,
    email: "bl***@gmail.com",
    timeAgo: "há 5h",
    credits: 400,
    text: "Muito obrigado pelo exelente trabalho",
  },
  {
    id: 4,
    email: "co***@leigosacademy.site",
    timeAgo: "há 6h",
    credits: 100,
    text: "Foi top 🔥 gostei de compra mais barato",
  },
  {
    id: 5,
    email: "bu***@gmail.com",
    timeAgo: "há 6h",
    credits: 300,
    text: "gostei foi bem rapido e super pratico recomendo",
  },
  {
    id: 6,
    email: "bu***@gmail.com",
    timeAgo: "há 13h",
    credits: 100,
    text: "os melhores do mercado de creditos do lovable...rapido e pratico",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            O que nossos clientes dizem
          </h2>
          <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
            <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
            <span className="font-bold text-foreground">100%</span>
            <span className="text-muted-foreground">de avaliações positivas</span>
            <span className="text-muted-foreground">(235 avaliações)</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-4 hover:border-primary/40 transition-all duration-300"
            >
              {/* Top row: email + badge */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-sm font-medium text-foreground">{testimonial.email}</span>
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{testimonial.timeAgo}</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                  <ThumbsUp className="w-3 h-3" />
                  Recomenda
                </span>
              </div>

              {/* Credits */}
              <div className="flex items-center gap-1.5 mb-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-foreground">{testimonial.credits} créditos</span>
              </div>

              {/* Text */}
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
