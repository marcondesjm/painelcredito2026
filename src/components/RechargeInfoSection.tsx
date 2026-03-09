import { Clock, Lock, Gift, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const RechargeInfoSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto text-center space-y-4 sm:space-y-5">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-2 flex-wrap">
          {t('recharge.title_pre')} {t('recharge.title_post')}
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
        </h3>

        <div className="space-y-2 sm:space-y-3">
          <p className="text-sm sm:text-base text-foreground flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-accent flex-shrink-0" />
            <span><strong className="text-accent">{t('recharge.secure')}</strong> • {t('recharge.no_ban')}</span>
          </p>
          <p className="text-sm sm:text-base text-foreground flex items-center justify-center gap-2">
            <Gift className="w-4 h-4 text-primary flex-shrink-0" />
            <span><strong className="text-accent">{t('recharge.bonus')}</strong> {t('recharge.bonus_suffix')}</span>
          </p>
        </div>

        <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 inline-flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-accent flex-shrink-0" />
          <span className="text-xs sm:text-sm text-muted-foreground">
            {t('recharge.credit_active_pre')} <strong className="text-foreground">{t('recharge.credit_active_bold')}</strong>
          </span>
        </div>
      </div>
    </section>
  );
};
