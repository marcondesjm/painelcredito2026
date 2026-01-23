import { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useAuth } from '@/hooks/useAuth';

interface EditorTourProps {
  isNewPage?: boolean;
}

export const EditorTour = ({ isNewPage }: EditorTourProps) => {
  const { user } = useAuth();
  const [hasSeenTour, setHasSeenTour] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    // Check if this specific user has seen the tour
    const tourKey = `editor-tour-seen-${user.id}`;
    const tourSeen = localStorage.getItem(tourKey);
    
    if (!tourSeen) {
      setHasSeenTour(false);
      // Small delay to ensure DOM is ready
      const timeout = setTimeout(() => {
        startTour();
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [user]);

  const startTour = () => {
    if (!user) return;
    
    const tourKey = `editor-tour-seen-${user.id}`;
    
    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: 'rgba(0, 0, 0, 0.8)',
      stagePadding: 10,
      popoverClass: 'driver-popover-custom',
      nextBtnText: 'Próximo →',
      prevBtnText: '← Anterior',
      doneBtnText: '🚀 Começar!',
      progressText: 'Passo {{current}} de {{total}}',
      allowClose: true,
      onDestroyStarted: () => {
        localStorage.setItem(tourKey, 'true');
        setHasSeenTour(true);
        driverObj.destroy();
      },
      steps: [
        {
          popover: {
            title: '🎉 Bem-vindo ao Editor de Landing Pages!',
            description: 'Este é seu painel para criar páginas de vendas incríveis. Vamos fazer um tour rápido por todas as funcionalidades?',
            side: 'over',
            align: 'center'
          }
        },
        {
          element: '#tour-tabs',
          popover: {
            title: '📑 Abas de Configuração',
            description: '<strong>Aqui você encontra todas as seções:</strong><br><br>• <strong>Básico:</strong> URL, título e publicação<br>• <strong>Layout:</strong> Ordem das seções<br>• <strong>Imagens:</strong> Logo, hero e background<br>• <strong>Preços:</strong> Valores e parcelamento<br>• <strong>Sobre:</strong> Informações do produto<br>• <strong>Doação:</strong> Configurar PIX<br>• <strong>Conteúdo:</strong> Features e passos<br>• <strong>Depoimentos:</strong> Avaliações de clientes<br>• <strong>FAQ:</strong> Perguntas frequentes<br>• <strong>SEO:</strong> Meta tags para Google',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '#tour-slug',
          popover: {
            title: '🔗 URL Amigável',
            description: 'Defina o endereço da sua página. Use o botão <strong>"Gerar"</strong> para criar automaticamente a partir do título. Exemplo: seusite.com/<strong>nome-do-produto</strong>',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#tour-title',
          popover: {
            title: '📝 Título da Página',
            description: 'Este título identifica sua página no dashboard. Escolha um nome que você lembre facilmente.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#tour-publish',
          popover: {
            title: '✨ Publicar sua Página',
            description: 'Quando sua página estiver pronta, <strong>ative esta opção</strong> para torná-la visível para o público. Páginas não publicadas ficam em rascunho.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#tour-colors',
          popover: {
            title: '🎨 Paleta de Cores',
            description: 'Escolha uma das <strong>paletas prontas</strong> ou personalize cada cor individualmente. As cores são aplicadas automaticamente em toda a página.',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '#tour-preview-toggle',
          popover: {
            title: '👁️ Mostrar/Ocultar Preview',
            description: 'Use este botão para <strong>mostrar ou esconder</strong> o preview em tempo real. Útil quando quiser focar apenas na edição.',
            side: 'bottom',
            align: 'end'
          }
        },
        {
          element: '#tour-save',
          popover: {
            title: '💾 Salvar Alterações',
            description: 'O sistema <strong>salva automaticamente</strong> suas alterações, mas você pode clicar aqui para salvar manualmente e voltar ao dashboard.',
            side: 'bottom',
            align: 'end'
          }
        },
        {
          element: '#tour-preview-area',
          popover: {
            title: '📱 Preview em Tempo Real',
            description: 'Aqui você vê exatamente como sua página ficará para os visitantes. As alterações aparecem <strong>instantaneamente</strong> enquanto você edita!',
            side: 'left',
            align: 'center'
          }
        },
        {
          popover: {
            title: '🚀 Pronto para começar!',
            description: '<strong>Dicas importantes:</strong><br><br>✅ Comece preenchendo as informações básicas<br>✅ Adicione imagens de alta qualidade<br>✅ Configure os preços corretamente<br>✅ Adicione depoimentos reais<br>✅ Publique quando estiver satisfeito<br><br>Clique em <strong>"Começar!"</strong> para criar sua primeira página incrível! 🎉',
            side: 'over',
            align: 'center'
          }
        }
      ]
    });

    driverObj.drive();
  };

  // Function to manually trigger the tour
  const restartTour = () => {
    startTour();
  };

  if (hasSeenTour) {
    return null;
  }

  return null;
};

// Export restart function for manual triggering
export const triggerEditorTour = (userId: string) => {
  const tourKey = `editor-tour-seen-${userId}`;
  localStorage.removeItem(tourKey);
  window.location.reload();
};

// Add custom styles for driver.js
const style = document.createElement('style');
style.textContent = `
  .driver-popover-custom {
    background: linear-gradient(145deg, hsl(240 10% 12%), hsl(240 10% 8%)) !important;
    border: 1px solid hsl(var(--primary) / 0.3) !important;
    color: hsl(var(--foreground)) !important;
    border-radius: 16px !important;
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.6),
      0 0 30px hsl(var(--primary) / 0.15) !important;
    max-width: 380px !important;
  }
  
  .driver-popover-custom .driver-popover-title {
    color: hsl(var(--foreground)) !important;
    font-size: 1.2rem !important;
    font-weight: 700 !important;
    margin-bottom: 12px !important;
  }
  
  .driver-popover-custom .driver-popover-description {
    color: hsl(var(--muted-foreground)) !important;
    font-size: 0.95rem !important;
    line-height: 1.6 !important;
  }
  
  .driver-popover-custom .driver-popover-description strong {
    color: hsl(var(--primary)) !important;
    font-weight: 600 !important;
  }
  
  .driver-popover-custom .driver-popover-progress-text {
    color: hsl(var(--muted-foreground)) !important;
    font-size: 0.8rem !important;
    font-weight: 500 !important;
  }
  
  .driver-popover-custom .driver-popover-prev-btn,
  .driver-popover-custom .driver-popover-next-btn {
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8)) !important;
    color: hsl(var(--primary-foreground)) !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 10px 20px !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
    font-size: 0.9rem !important;
  }
  
  .driver-popover-custom .driver-popover-prev-btn:hover,
  .driver-popover-custom .driver-popover-next-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 15px hsl(var(--primary) / 0.4) !important;
  }
  
  .driver-popover-custom .driver-popover-prev-btn {
    background: transparent !important;
    color: hsl(var(--muted-foreground)) !important;
    border: 1px solid hsl(var(--border)) !important;
  }
  
  .driver-popover-custom .driver-popover-prev-btn:hover {
    background: hsl(var(--muted) / 0.3) !important;
    color: hsl(var(--foreground)) !important;
    box-shadow: none !important;
  }
  
  .driver-popover-custom .driver-popover-close-btn {
    color: hsl(var(--muted-foreground)) !important;
    font-size: 1.2rem !important;
    transition: color 0.2s !important;
  }
  
  .driver-popover-custom .driver-popover-close-btn:hover {
    color: hsl(var(--foreground)) !important;
  }
  
  .driver-popover-custom .driver-popover-arrow-side-bottom {
    border-bottom-color: hsl(240 10% 12%) !important;
  }
  
  .driver-popover-custom .driver-popover-arrow-side-top {
    border-top-color: hsl(240 10% 12%) !important;
  }
  
  .driver-popover-custom .driver-popover-arrow-side-left {
    border-left-color: hsl(240 10% 12%) !important;
  }
  
  .driver-popover-custom .driver-popover-arrow-side-right {
    border-right-color: hsl(240 10% 12%) !important;
  }

  .driver-overlay {
    background: rgba(0, 0, 0, 0.85) !important;
  }
  
  .driver-active-element {
    box-shadow: 0 0 0 4px hsl(var(--primary) / 0.5) !important;
    border-radius: 8px !important;
  }
`;
document.head.appendChild(style);
