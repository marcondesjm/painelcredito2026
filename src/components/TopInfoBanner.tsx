import { useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';

export const TopInfoBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-card/95 backdrop-blur-sm border-b border-accent/50">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-2 sm:px-4">
        <div className="flex-1 flex items-center justify-center gap-2">
          <ShoppingCart className="w-4 h-4 text-accent shrink-0" />
          <p className="text-xs sm:text-sm font-bold text-accent leading-tight text-center">
            Compre a ativação e comece a gerar créditos agora!
          </p>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="ml-2 hover:opacity-70 transition-opacity text-muted-foreground"
          aria-label="Fechar aviso"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
