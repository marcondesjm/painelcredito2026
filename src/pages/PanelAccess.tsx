import { useEffect, useState } from 'react';

const PanelAccess = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      {/* Top mask to hide the promo banner */}
      <div className="absolute top-0 left-0 right-0 h-[40px] bg-[#0a0f1a] z-10" />
      {/* Bottom mask to hide "Criar conta" link */}
      <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-[#0a0f1a] z-10" />
      <div className="w-full h-full overflow-hidden">
        <iframe
          src="https://www.painelcreditoslovable.com/auth"
          className="w-full border-0"
          style={{ height: 'calc(100% + 120px)', marginTop: '-40px' }}
          title="Painel Gerador de Créditos"
          allow="clipboard-read; clipboard-write; payment"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};

export default PanelAccess;
