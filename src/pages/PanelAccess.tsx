import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PanelAccess = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Small delay to show loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        <p className="text-white/70 text-sm">Carregando painel...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0a0f1a] overflow-hidden">
      {/* Overlay to cover the top header/nav of the external site */}
      <div className="absolute top-0 left-0 right-0 h-[60px] bg-[#0a0f1a] z-10" />
      {/* Container that clips the iframe at the bottom to hide content below "Adicionar Saldo" */}
      <div className="w-full" style={{ height: 'calc(100vh + 200px)', overflow: 'hidden' }}>
        <iframe
          src="https://www.painelcreditoslovable.com/"
          className="w-full border-0"
          style={{ height: 'calc(100vh + 600px)', marginTop: '-60px' }}
          title="Painel Gerador de Créditos"
          allow="clipboard-read; clipboard-write; payment"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};

export default PanelAccess;
