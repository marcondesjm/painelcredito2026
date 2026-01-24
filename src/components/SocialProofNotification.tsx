import { useState, useEffect } from 'react';
import { ShoppingCart, X } from 'lucide-react';

export interface SocialProofCustomer {
  name: string;
  city: string;
  state: string;
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

const getRandomTime = () => {
  const minutes = Math.floor(Math.random() * 10) + 1;
  return `${minutes} min atrás`;
};

const getRandomCredits = (options: number[]) => {
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
};

export const SocialProofNotification = ({ 
  enabled = true, 
  productName = 'o Gerador',
  customers = defaultCustomers,
  creditOptions = defaultCreditOptions
}: SocialProofNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(customers[0] || defaultCustomers[0]);
  const [currentCredits, setCurrentCredits] = useState(creditOptions[0] || 1000);
  const [time, setTime] = useState(getRandomTime());

  const activeCustomers = customers && customers.length > 0 ? customers : defaultCustomers;
  const activeCreditOptions = creditOptions && creditOptions.length > 0 ? creditOptions : defaultCreditOptions;

  useEffect(() => {
    if (!enabled) return;
    
    // Initial delay before first notification
    const initialDelay = setTimeout(() => {
      showNotification();
    }, 5000);

    return () => clearTimeout(initialDelay);
  }, [enabled]);

  const showNotification = () => {
    if (!enabled) return;
    
    // Pick a random customer and credit amount
    const randomCustomerIndex = Math.floor(Math.random() * activeCustomers.length);
    setCurrentCustomer(activeCustomers[randomCustomerIndex]);
    setCurrentCredits(getRandomCredits(activeCreditOptions));
    setTime(getRandomTime());
    setIsVisible(true);

    // Hide after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
      
      // Schedule next notification (15-30 seconds)
      const nextDelay = Math.floor(Math.random() * 15000) + 15000;
      setTimeout(showNotification, nextDelay);
    }, 5000);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!enabled || !isVisible) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-2 sm:left-4 z-40 animate-in slide-in-from-left-full duration-500 max-w-[calc(100vw-1rem)] sm:max-w-sm">
      <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
        {/* Icon */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-foreground">
            <span className="text-primary">{currentCustomer.name}</span> adquiriu {productName}
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
            <span className="text-accent font-medium">{currentCredits} créditos</span> • {currentCustomer.city}, {currentCustomer.state} • {time}
          </p>
        </div>

        {/* Close button */}
        <button 
          onClick={handleClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-0.5 sm:p-1 -mr-1 -mt-1"
          aria-label="Fechar notificação"
        >
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};
