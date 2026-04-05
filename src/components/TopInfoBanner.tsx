import { useState } from 'react';
import { X, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TopInfoBanner = () => {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-card/95 backdrop-blur-sm border-b border-accent/50">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-2 sm:px-4">
        <button
          type="button"
          onClick={() => navigate('/x7k9m2p4')}
          className="flex-1 flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Eye className="w-4 h-4 text-accent shrink-0" />
          <span className="text-sm sm:text-base">👀</span>
          <div className="text-left">
            <p className="text-xs sm:text-sm font-bold text-accent leading-tight">
              Veja os valores de revenda aqui
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
              Clique para ver quanto você pode lucrar
            </p>
          </div>
        </button>
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