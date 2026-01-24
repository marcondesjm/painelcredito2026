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
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-whatsapp rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 hover:shadow-[0_0_20px_hsl(var(--whatsapp)_/_0.5)]"
    >
      <MessageCircle className="w-7 h-7 text-foreground" fill="currentColor" />
    </a>
  );
};
