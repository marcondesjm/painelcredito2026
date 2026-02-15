import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 5, minutes: 34, seconds: 53 });
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (totalSeconds <= 0) {
          return { hours: 5, minutes: 34, seconds: 53 };
        }
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-card/80 border border-border/50 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm">
      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
      <span className="text-xs sm:text-sm text-muted-foreground">{t('hero.expires_in')}</span>
      <div className="bg-muted rounded-md px-1.5 sm:px-2 py-0.5 sm:py-1">
        <span className="text-xs sm:text-sm font-mono font-bold text-foreground">
          {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
        </span>
      </div>
    </div>
  );
};
