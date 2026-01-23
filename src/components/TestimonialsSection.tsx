import { Card } from '@/components/ui/card';
import { MessageCircle, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Carlos M.",
    text: "Consegui mais de 500 créditos em uma semana! O painel é muito fácil de usar.",
    rating: 5,
  },
  {
    id: 2,
    name: "Ana Paula S.",
    text: "Melhor investimento que fiz. O suporte é excelente e os créditos chegam rápido.",
    rating: 5,
  },
  {
    id: 3,
    name: "Roberto F.",
    text: "Estava cético no início, mas funcionou perfeitamente. Recomendo a todos!",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            O que nossa <span className="text-gradient">comunidade</span> diz
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Veja o que os clientes da nossa comunidade estão achando do painel
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className="bg-card/50 backdrop-blur-sm border-border/50 p-6 hover:border-primary/50 transition-all duration-300"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground/90 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">Cliente verificado</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
