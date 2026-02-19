import { useState, useEffect, useMemo } from 'react';

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

const formatDate = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
};

const generateFakeTime = (index: number) => {
  const baseHour = 9 + Math.floor(index * 1.3);
  const hour = String(baseHour % 24).padStart(2, '0');
  const min = String((index * 17 + 3) % 60).padStart(2, '0');
  return `${hour}:${min}`;
};

export const FakeImplementationLog = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const today = useMemo(() => formatDate(), []);

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
    <div className="mt-4 flex flex-col items-center gap-1">
      <p
        className={`text-xs sm:text-sm font-mono text-primary/80 transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {messages[currentIndex]}
      </p>
      <span
        className={`text-[10px] sm:text-xs font-mono text-muted-foreground/60 transition-all duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        📅 {today} — 🕐 {generateFakeTime(currentIndex)}
      </span>
    </div>
  );
};
