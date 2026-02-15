import { Star, Clock, ThumbsUp, Zap } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const testimonials_pt = [
  { id: 1, email: "mn***@gmail.com", timeAgo: "há 2h", credits: 50, text: "Experiência incrível, recarrega de forma rápida os créditos. Parabéns a equipe que desenvolveu o Lovable Credits :)" },
  { id: 2, email: "ad***@leieimici.online", timeAgo: "há 3h", credits: 30, text: "Isso aqui é surreal de bom" },
  { id: 3, email: "bl***@gmail.com", timeAgo: "há 5h", credits: 400, text: "Muito obrigado pelo exelente trabalho" },
  { id: 4, email: "co***@leigosacademy.site", timeAgo: "há 6h", credits: 100, text: "Foi top 🔥 gostei de compra mais barato" },
  { id: 5, email: "bu***@gmail.com", timeAgo: "há 6h", credits: 300, text: "gostei foi bem rapido e super pratico recomendo" },
  { id: 6, email: "bu***@gmail.com", timeAgo: "há 13h", credits: 100, text: "os melhores do mercado de creditos do lovable...rapido e pratico" },
];

const testimonials_en = [
  { id: 1, email: "mn***@gmail.com", timeAgo: "2h ago", credits: 50, text: "Incredible experience, recharges credits quickly. Congrats to the team that developed Lovable Credits :)" },
  { id: 2, email: "ad***@leieimici.online", timeAgo: "3h ago", credits: 30, text: "This is unbelievably good" },
  { id: 3, email: "bl***@gmail.com", timeAgo: "5h ago", credits: 400, text: "Thank you so much for the excellent work" },
  { id: 4, email: "co***@leigosacademy.site", timeAgo: "6h ago", credits: 100, text: "It was great 🔥 loved buying it cheaper" },
  { id: 5, email: "bu***@gmail.com", timeAgo: "6h ago", credits: 300, text: "loved it, very fast and super practical, I recommend it" },
  { id: 6, email: "bu***@gmail.com", timeAgo: "13h ago", credits: 100, text: "the best in the lovable credits market...fast and practical" },
];

export const TestimonialsSection = () => {
  const { t, language } = useLanguage();
  const testimonials = language === 'en' ? testimonials_en : testimonials_pt;

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            {t('testimonials.title')}
          </h2>
          <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
            <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
            <span className="font-bold text-foreground">100%</span>
            <span className="text-muted-foreground">{t('testimonials.positive')}</span>
            <span className="text-muted-foreground">(235 {t('testimonials.reviews')})</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-4 hover:border-primary/40 transition-all duration-300">
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
                  {t('testimonials.recommends')}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mb-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-foreground">{testimonial.credits} {t('testimonials.credits')}</span>
              </div>

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
