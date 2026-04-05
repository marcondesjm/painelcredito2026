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
    <div className="fixed inset-0 bg-[#0a0f1a]">
      {/* CSS to hide the "Acessar" button and nav login elements inside the iframe */}
      <iframe
        src="https://www.painelcreditoslovable.com/"
        className="w-full h-full border-0"
        title="Painel Gerador de Créditos"
        allow="clipboard-read; clipboard-write"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export default PanelAccess;
