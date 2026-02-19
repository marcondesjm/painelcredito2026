import { useState, useEffect } from 'react';

const messages = [
  '🔧 Compilando módulos de créditos...',
  '⚙️ Configurando API de geração...',
  '📦 Instalando dependências do painel...',
  '🔐 Criptografando chaves de acesso...',
  '🚀 Otimizando velocidade do servidor...',
  '🧠 Treinando modelo de automação...',
  '📊 Sincronizando banco de dados...',
  '🔄 Atualizando sistema de renovação...',
  '✅ Validando integridade dos módulos...',
  '🛡️ Aplicando camadas de segurança...',
  '💾 Salvando configurações do painel...',
  '🌐 Conectando servidores globais...',
];

export const FakeImplementationLog = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 400);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 h-8 flex items-center justify-center">
      <p
        className={`text-xs sm:text-sm font-mono text-primary/80 transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {messages[currentIndex]}
      </p>
    </div>
  );
};
