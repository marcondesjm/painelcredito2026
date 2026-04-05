import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreditCard } from 'lucide-react';

interface ResellerValuesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const packages = [
  { credits: 50, price: 'R$ 2,50', discount: null },
  { credits: 100, price: 'R$ 5,00', discount: null },
  { credits: 500, price: 'R$ 22,23', discount: '10% off' },
  { credits: 1000, price: 'R$ 37,52', discount: '20% off' },
  { credits: 2000, price: 'R$ 72,36', discount: '30% off' },
  { credits: 5000, price: 'R$ 160,79', discount: '40% off' },
  { credits: 10000, price: 'R$ 300,15', discount: '44% off' },
];

export const ResellerValuesModal = ({ open, onOpenChange }: ResellerValuesModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-center text-sm sm:text-base font-bold tracking-wide text-muted-foreground">
            PACOTES POPULARES — VALORES REAIS
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
          {packages.map((pkg) => (
            <div
              key={pkg.credits}
              className="relative flex flex-col items-center justify-center gap-1 rounded-xl border border-border/60 bg-background/60 p-3 text-center"
            >
              {pkg.discount && (
                <span className="absolute -top-2.5 right-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                  {pkg.discount}
                </span>
              )}
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-accent" />
                <span className="text-base sm:text-lg font-bold text-foreground">
                  {pkg.credits.toLocaleString('pt-BR')}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-accent font-semibold">
                {pkg.price}
              </span>
            </div>
          ))}
        </div>

        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-3">
          💰 Compre o painel por <span className="font-bold text-accent">R$ 199</span> e revenda créditos com lucro!
        </p>
      </DialogContent>
    </Dialog>
  );
};
