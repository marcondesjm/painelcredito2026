import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

export const FinalCTASection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
          {t('cta.title_pre')} <span className="text-primary">{t('cta.title_highlight')}</span>?
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 px-2">
          {t('cta.subtitle')}
        </p>
      </div>
    </section>
  );
};
