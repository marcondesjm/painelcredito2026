import { useEffect } from 'react';

export const useSecurityProtection = () => {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts for dev tools and source view
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I (Dev Tools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      // Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
    };

    // Disable text selection on sensitive areas
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      // Allow selection in input/textarea fields
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return true;
      }
      // Allow selection in admin dashboard
      if (target.closest('[data-allow-select]')) {
        return true;
      }
    };

    // Disable drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    // Console warning
    const warningStyle = 'color: red; font-size: 24px; font-weight: bold;';
    console.log('%c⚠️ ATENÇÃO!', warningStyle);
    console.log('%cEste é um recurso do navegador destinado a desenvolvedores. Se alguém disse para você copiar e colar algo aqui, isso é uma fraude.', 'font-size: 14px;');

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);
};
