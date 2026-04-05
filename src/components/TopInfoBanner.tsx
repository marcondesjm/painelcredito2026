import { useState } from 'react';
import { X, Megaphone } from 'lucide-react';

export const TopInfoBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-accent via-primary to-accent text-white">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto] items-start gap-2 px-3 py-2 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:px-4">
        <Megaphone className="mt-0.5 hidden w-4 h-4 shrink-0 sm:block" />
        <p className="text-center text-[11px] font-semibold leading-tight sm:text-sm">
          Compre a ativação do painel de créditos e mais 50 reais ganhe uma landing page igual essa pra vender seus créditos
        </p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="mt-0.5 justify-self-end hover:opacity-70 transition-opacity sm:mt-0"
          aria-label="Fechar aviso"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
