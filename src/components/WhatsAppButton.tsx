import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  number?: string;
  message?: string;
}

export const WhatsAppButton = ({ number, message }: WhatsAppButtonProps) => {
  // Se não tiver número configurado, não exibe o botão
  if (!number) return null;
  
  const encodedMessage = message ? encodeURIComponent(message) : '';
  const whatsappUrl = `https://wa.me/${number}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
  
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 w-12 h-12 md:w-14 md:h-14 md:bottom-6 md:right-6 bg-whatsapp rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 hover:shadow-[0_0_20px_hsl(var(--whatsapp)_/_0.5)]"
    >
      <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-foreground" fill="currentColor" />
    </a>
  );
};
