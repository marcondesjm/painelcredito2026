import { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

interface EditorTourProps {
  isNewPage: boolean;
}

export const EditorTour = ({ isNewPage }: EditorTourProps) => {
  const [hasSeenTour, setHasSeenTour] = useState(true);

  useEffect(() => {
    // Only show tour for new pages and if user hasn't seen it
    const tourSeen = localStorage.getItem('editor-tour-seen');
    if (!tourSeen && isNewPage) {
      setHasSeenTour(false);
      // Small delay to ensure DOM is ready
      const timeout = setTimeout(() => {
        startTour();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isNewPage]);

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: 'rgba(0, 0, 0, 0.75)',
      stagePadding: 8,
      popoverClass: 'driver-popover-custom',
      nextBtnText: 'Próximo',
      prevBtnText: 'Anterior',
      doneBtnText: 'Começar!',
      progressText: '{{current}} de {{total}}',
      onDestroyStarted: () => {
        localStorage.setItem('editor-tour-seen', 'true');
        setHasSeenTour(true);
        driverObj.destroy();
      },
      steps: [
        {
          element: '#tour-header',
          popover: {
            title: '🎉 Bem-vindo ao Editor!',
            description: 'Aqui você vai criar sua landing page incrível. Vamos fazer um tour rápido?',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '#tour-tabs',
          popover: {
            title: '📑 Abas de Configuração',
            description: 'Organize sua página usando estas abas: Básico, Imagens, Preços, Sobre, Doação, Conteúdo, Depoimentos e SEO.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '#tour-slug',
          popover: {
            title: '🔗 URL da Página',
            description: 'Defina a URL amigável da sua página. Use o botão "Gerar" para criar automaticamente a partir do título.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#tour-title',
          popover: {
            title: '📝 Título da Página',
            description: 'Dê um nome para sua landing page. Esse título ajuda você a identificar a página no dashboard.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#tour-publish',
          popover: {
            title: '✨ Publicar',
            description: 'Quando sua página estiver pronta, ative esta opção para torná-la pública.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#tour-colors',
          popover: {
            title: '🎨 Paleta de Cores',
            description: 'Escolha uma combinação de cores que combina com sua marca. Você pode personalizar cada cor individualmente.',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '#tour-preview-toggle',
          popover: {
            title: '👁️ Preview em Tempo Real',
            description: 'Veja as mudanças instantaneamente! Use este botão para mostrar/ocultar o preview.',
            side: 'bottom',
            align: 'end'
          }
        },
        {
          element: '#tour-save',
          popover: {
            title: '💾 Salvar',
            description: 'Não esqueça de salvar suas alterações! Clique aqui quando terminar.',
            side: 'bottom',
            align: 'end'
          }
        }
      ]
    });

    driverObj.drive();
  };

  if (hasSeenTour) {
    return null;
  }

  return null;
};

// Add custom styles for driver.js
const style = document.createElement('style');
style.textContent = `
  .driver-popover-custom {
    background: hsl(240 10% 10%) !important;
    border: 1px solid hsl(var(--border)) !important;
    color: hsl(var(--foreground)) !important;
    border-radius: 12px !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
  }
  
  .driver-popover-custom .driver-popover-title {
    color: hsl(var(--foreground)) !important;
    font-size: 1.1rem !important;
    font-weight: 600 !important;
  }
  
  .driver-popover-custom .driver-popover-description {
    color: hsl(var(--muted-foreground)) !important;
    font-size: 0.9rem !important;
    line-height: 1.5 !important;
  }
  
  .driver-popover-custom .driver-popover-progress-text {
    color: hsl(var(--muted-foreground)) !important;
    font-size: 0.75rem !important;
  }
  
  .driver-popover-custom .driver-popover-prev-btn,
  .driver-popover-custom .driver-popover-next-btn {
    background: hsl(var(--primary)) !important;
    color: hsl(var(--primary-foreground)) !important;
    border: none !important;
    border-radius: 6px !important;
    padding: 8px 16px !important;
    font-weight: 500 !important;
    transition: all 0.2s !important;
  }
  
  .driver-popover-custom .driver-popover-prev-btn:hover,
  .driver-popover-custom .driver-popover-next-btn:hover {
    opacity: 0.9 !important;
    transform: translateY(-1px) !important;
  }
  
  .driver-popover-custom .driver-popover-prev-btn {
    background: transparent !important;
    color: hsl(var(--muted-foreground)) !important;
    border: 1px solid hsl(var(--border)) !important;
  }
  
  .driver-popover-custom .driver-popover-close-btn {
    color: hsl(var(--muted-foreground)) !important;
  }
  
  .driver-popover-custom .driver-popover-arrow-side-bottom {
    border-bottom-color: hsl(240 10% 10%) !important;
  }
  
  .driver-popover-custom .driver-popover-arrow-side-top {
    border-top-color: hsl(240 10% 10%) !important;
  }
  
  .driver-popover-custom .driver-popover-arrow-side-left {
    border-left-color: hsl(240 10% 10%) !important;
  }
  
  .driver-popover-custom .driver-popover-arrow-side-right {
    border-right-color: hsl(240 10% 10%) !important;
  }
`;
document.head.appendChild(style);
