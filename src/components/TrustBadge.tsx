import { LucideIcon } from 'lucide-react';

interface TrustBadgeProps {
  icon: LucideIcon;
  text: string;
}

export const TrustBadge = ({ icon: Icon, text }: TrustBadgeProps) => {
  return (
    <div className="flex items-center gap-2 bg-card/50 border border-border/50 rounded-full px-4 py-2 backdrop-blur-sm">
      <Icon className="w-4 h-4 text-accent" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
};
