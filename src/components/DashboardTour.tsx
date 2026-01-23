import { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useAuth } from '@/hooks/useAuth';

export const DashboardTour = () => {
  const { user } = useAuth();
  const [hasSeenTour, setHasSeenTour] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    // Check if this specific user has seen the dashboard tour
    const tourKey = `dashboard-tour-seen-${user.id}`;
    const tourSeen = localStorage.getItem(tourKey);
    
    if (!tourSeen) {
      setHasSeenTour(false);
      // Delay to ensure DOM is ready
      const timeout = setTimeout(() => {
        startTour();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [user]);

  const startTour = () => {
    if (!user) return;
    
    const tourKey = `dashboard-tour-seen-${user.id}`;
    
    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: 'rgba(0, 0, 0, 0.8)',
      stagePadding: 10,
      popoverClass: 'driver-popover-custom',
      nextBtnText: 'Próximo →',
      prevBtnText: '← Anterior',
      doneBtnText: '🚀 Vamos lá!',
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
            title: '🎉 Bem-vindo ao seu Dashboard!',
            description: 'Este é o seu painel de controle onde você gerencia todas as suas landing pages. Vamos fazer um tour rápido!',
            side: 'over',
            align: 'center'
          }
        },
        {
          element: '#tour-dashboard-new-btn',
          popover: {
            title: '➕ Criar Nova Página',
            description: 'Clique aqui para <strong>criar uma nova landing page</strong>. Você será levado ao editor visual onde pode personalizar tudo!',
            side: 'bottom',
            align: 'end'
          }
        },
        {
          element: '#tour-dashboard-pages',
          popover: {
            title: '📄 Suas Landing Pages',
            description: 'Aqui você verá <strong>todas as suas páginas</strong>. Cada card mostra o título, URL e status (Publicada ou Rascunho).',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '#tour-dashboard-donate',
          popover: {
            title: '💚 Apoiar o Projeto',
            description: 'Gostou do sistema? Você pode <strong>fazer uma doação via PIX</strong> para ajudar no desenvolvimento de novas funcionalidades!',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '#tour-dashboard-site',
          popover: {
            title: '🌐 Ver Site Principal',
            description: 'Clique aqui para <strong>voltar ao site principal</strong> e ver como os visitantes veem sua página.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          popover: {
            title: '🚀 Pronto para começar!',
            description: '<strong>Próximos passos:</strong><br><br>1️⃣ Clique em "Nova Página" para criar sua primeira landing page<br>2️⃣ Personalize com suas cores, textos e imagens<br>3️⃣ Publique e compartilhe com seu público!<br><br>Clique em <strong>"Vamos lá!"</strong> para começar! 🎉',
            side: 'over',
            align: 'center'
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

// Export restart function for manual triggering
export const triggerDashboardTour = (userId: string) => {
  const tourKey = `dashboard-tour-seen-${userId}`;
  localStorage.removeItem(tourKey);
  window.location.reload();
};
