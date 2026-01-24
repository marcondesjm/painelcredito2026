import { MessageCircle, RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_VERSION, LAST_UPDATE } from '@/config/version';
import { toast } from 'sonner';
import { useState } from 'react';

export const Footer = () => {
  const [clearing, setClearing] = useState(false);

  const handleClearCache = async () => {
    setClearing(true);
    try {
      // Limpa o cache do navegador
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Limpa localStorage e sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      
      toast.success('Cache limpo com sucesso! Recarregando...');
      
      // Força recarregar a página ignorando o cache
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      toast.error('Erro ao limpar cache');
    } finally {
      setClearing(false);
    }
  };

  return (
    <footer className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 border-t border-border/30">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Button variant="outline" size="default" className="gap-2 w-full sm:w-auto">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            Suporte via WhatsApp
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearCache}
            disabled={clearing}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`w-4 h-4 ${clearing ? 'animate-spin' : ''}`} />
            {clearing ? 'Limpando...' : 'Limpar Cache'}
          </Button>
        </div>
        
        <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
          © 2026 Painel Gerador de Créditos. Todos os direitos reservados.
        </p>

        {/* Versão e Data de Atualização */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 md:gap-4 text-xs text-muted-foreground/70">
          <div className="flex items-center gap-1">
            <Info className="w-3 h-3" />
            <span>Versão {APP_VERSION}</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span>Atualizado em {LAST_UPDATE}</span>
        </div>
      </div>
    </footer>
  );
};
