import { useState, useEffect } from 'react';
import { Shield, Cookie, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';

export const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);
  const [userIp, setUserIp] = useState<string>('');

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 1500);
      // Fetch user IP
      fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => setUserIp(data.ip))
        .catch(() => setUserIp('Não identificado'));
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'essential_only');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-in slide-in-from-bottom-full duration-500">
      <div className="bg-card/95 backdrop-blur-md border-t border-border shadow-2xl">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Icon + Text */}
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Cookie className="w-4 h-4" />
                  Proteção de Dados & Cookies
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Utilizamos cookies essenciais para o funcionamento do site e cookies analíticos para melhorar sua experiência. 
                  Seus dados são protegidos conforme a{' '}
                  <Link to="/privacidade" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
                    Lei Geral de Proteção de Dados (LGPD)
                  </Link>
                  . Ao continuar navegando, você concorda com nossa{' '}
                  <Link to="/privacidade" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
                    Política de Privacidade
                  </Link>{' '}
                  e{' '}
                  <Link to="/termos" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
                    Termos de Uso
                  </Link>.
                </p>
                {userIp && (
                  <p className="text-[10px] text-muted-foreground/70 flex items-center gap-1 mt-1">
                    <Wifi className="w-3 h-3" />
                    Seu IP: <span className="font-mono">{userIp}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
                className="text-xs flex-1 sm:flex-initial"
              >
                Apenas Essenciais
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="text-xs flex-1 sm:flex-initial"
              >
                Aceitar Todos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
