import { useState } from 'react';
import { X, Megaphone } from 'lucide-react';

export const TopInfoBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-accent via-primary to-accent text-white text-center text-xs sm:text-sm font-semibold py-2 pl-4 pr-10 flex items-center justify-center gap-2">
      <Megaphone className="w-4 h-4 shrink-0 hidden sm:block" />
      <span className="leading-tight">Compre a ativação do painel de créditos e mais 50 reais ganhe uma landing page igual essa pra vender seus créditos</span>
      <button onClick={() => setVisible(false)} className="absolute right-2 top-2 hover:opacity-70 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
