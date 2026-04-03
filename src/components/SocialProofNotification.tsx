import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export interface SocialProofCustomer {
  name: string;
  city: string;
  state: string;
  product?: 'gerador' | 'creditos';
}

interface SocialProofNotificationProps {
  enabled?: boolean;
  productName?: string;
  customers?: SocialProofCustomer[];
  creditOptions?: number[];
}

const defaultCustomers: SocialProofCustomer[] = [
  { name: "Carlos M.", city: "São Paulo", state: "SP" },
  { name: "Ana Paula S.", city: "Rio de Janeiro", state: "RJ" },
  { name: "Roberto F.", city: "Belo Horizonte", state: "MG" },
  { name: "Juliana C.", city: "Curitiba", state: "PR" },
  { name: "Fernando L.", city: "Salvador", state: "BA" },
  { name: "Mariana R.", city: "Brasília", state: "DF" },
  { name: "Pedro H.", city: "Porto Alegre", state: "RS" },
  { name: "Thiago N.", city: "Florianópolis", state: "SC" },
];

const defaultCreditOptions = [200, 500, 1000, 2000];

export const SocialProofNotification = ({ 
  enabled = true, 
  productName = 'o Gerador',
  customers,
  creditOptions
}: SocialProofNotificationProps) => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [notification, setNotification] = useState({ name: '', city: '', state: '', credits: 0, time: '', product: '' as string | undefined });
  
  // Use refs to avoid stale closures
  const customersRef = useRef(customers && customers.length > 0 ? customers : defaultCustomers);
  const creditsRef = useRef(creditOptions && creditOptions.length > 0 ? creditOptions : defaultCreditOptions);
  const langRef = useRef(language);
  const timerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  customersRef.current = customers && customers.length > 0 ? customers : defaultCustomers;
  creditsRef.current = creditOptions && creditOptions.length > 0 ? creditOptions : defaultCreditOptions;
  langRef.current = language;

  useEffect(() => {
    if (!enabled) return;

    const showNext = () => {
      const c = customersRef.current;
      const cr = creditsRef.current;
      const customer = c[Math.floor(Math.random() * c.length)];
      const credits = cr[Math.floor(Math.random() * cr.length)];
      const mins = Math.floor(Math.random() * 10) + 1;
      const time = langRef.current === 'en' ? `${mins} min ago` : `há ${mins} min`;

      setNotification({ name: customer.name, city: customer.city, state: customer.state, credits, time, product: customer.product });
      setIsVisible(true);

      hideTimerRef.current = window.setTimeout(() => {
        setIsVisible(false);
        const nextDelay = Math.floor(Math.random() * 15000) + 15000;
        timerRef.current = window.setTimeout(showNext, nextDelay);
      }, 5000);
    };

    timerRef.current = window.setTimeout(showNext, 5000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [enabled]);

  if (!isVisible) return null;

  const purchaseText = language === 'en'
    ? `purchased ${notification.product === 'creditos' ? `${notification.credits} credits` : (productName || 'the Generator')}`
    : `adquiriu ${notification.product === 'creditos' ? `${notification.credits} créditos` : (productName || 'o Gerador')}`;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-2 sm:left-4 z-40 animate-in slide-in-from-left-full duration-500 max-w-[calc(100vw-1rem)] sm:max-w-sm">
      <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-foreground">
            <span className="text-primary">{notification.name}</span>{' '}
            {purchaseText}
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
            {notification.city}, {notification.state} • {notification.time}
          </p>
        </div>

        <button 
          onClick={() => setIsVisible(false)}
          className="text-muted-foreground hover:text-foreground transition-colors p-0.5 sm:p-1 -mr-1 -mt-1"
          aria-label="Fechar notificação"
        >
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};
