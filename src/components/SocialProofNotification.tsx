import { useState, useEffect } from 'react';
import { ShoppingCart, X } from 'lucide-react';

const customers = [
  { name: "Carlos M.", city: "São Paulo", state: "SP" },
  { name: "Ana Paula S.", city: "Rio de Janeiro", state: "RJ" },
  { name: "Roberto F.", city: "Belo Horizonte", state: "MG" },
  { name: "Juliana C.", city: "Curitiba", state: "PR" },
  { name: "Fernando L.", city: "Salvador", state: "BA" },
  { name: "Mariana R.", city: "Brasília", state: "DF" },
  { name: "Lucas P.", city: "Fortaleza", state: "CE" },
  { name: "Beatriz A.", city: "Recife", state: "PE" },
  { name: "Pedro H.", city: "Porto Alegre", state: "RS" },
  { name: "Camila S.", city: "Goiânia", state: "GO" },
  { name: "Rafael M.", city: "Manaus", state: "AM" },
  { name: "Larissa T.", city: "Campinas", state: "SP" },
  { name: "Thiago N.", city: "Florianópolis", state: "SC" },
  { name: "Isabela D.", city: "Vitória", state: "ES" },
  { name: "Gustavo B.", city: "Natal", state: "RN" },
];

const getRandomTime = () => {
  const minutes = Math.floor(Math.random() * 10) + 1;
  return `${minutes} min atrás`;
};

export const SocialProofNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(customers[0]);
  const [time, setTime] = useState(getRandomTime());

  useEffect(() => {
    // Initial delay before first notification
    const initialDelay = setTimeout(() => {
      showNotification();
    }, 5000);

    return () => clearTimeout(initialDelay);
  }, []);

  const showNotification = () => {
    // Pick a random customer
    const randomIndex = Math.floor(Math.random() * customers.length);
    setCurrentCustomer(customers[randomIndex]);
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

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-left-full duration-500">
      <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-xl p-4 max-w-sm flex items-start gap-3">
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <ShoppingCart className="w-5 h-5 text-primary" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">
            <span className="text-primary">{currentCustomer.name}</span> adquiriu o Gerador
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {currentCustomer.city}, {currentCustomer.state} • {time}
          </p>
        </div>

        {/* Close button */}
        <button 
          onClick={handleClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 -mr-1 -mt-1"
          aria-label="Fechar notificação"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
