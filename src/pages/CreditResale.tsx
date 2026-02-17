import { useState, useMemo, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, Wallet, X, Copy, Check, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generatePixQRCode } from '@/lib/pix';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import backgroundHero from '@/assets/background-hero.png';

const POPULAR_PACKAGES = [
  { credits: 100, price: 3.5, discount: null },
  { credits: 500, price: 15.17, discount: '10% off' },
  { credits: 1000, price: 24.5, discount: '20% off' },
  { credits: 2000, price: 47.25, discount: '30% off' },
  { credits: 5000, price: 105.0, discount: '40% off' },
  { credits: 10000, price: 196.0, discount: '44% off' },
];

const PIX_KEY = '+5548996029392';
const PIX_NAME = 'Marcondes Jorge Machado';

const BASE_RATE = 3.5 / 100;

function calculatePrice(credits: number): number {
  if (credits >= 10000) return credits * (196 / 10000);
  if (credits >= 5000) return credits * (105 / 5000);
  if (credits >= 2000) return credits * (47.25 / 2000);
  if (credits >= 1000) return credits * (24.5 / 1000);
  if (credits >= 500) return credits * (15.17 / 500);
  return credits * BASE_RATE;
}

function formatNumber(n: number): string {
  return n.toLocaleString('pt-BR');
}

function formatCurrency(n: number): string {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const CreditResale = () => {
  const [credits, setCredits] = useState(5000);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState(5);
  const [pixGenerated, setPixGenerated] = useState(false);
  const [pixPayload, setPixPayload] = useState('');
  const [pixQrUrl, setPixQrUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [insufficientInfo, setInsufficientInfo] = useState<{ needed: number; credits: number } | null>(null);
  const [pixTimer, setPixTimer] = useState(600); // 10 min countdown
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Timer for PIX expiration
  useEffect(() => {
    if (pixGenerated) {
      setPixTimer(600);
      timerRef.current = setInterval(() => {
        setPixTimer(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pixGenerated]);

  // Fetch user balance
  useEffect(() => {
    if (!user) return;
    const fetchBalance = async () => {
      const { data } = await supabase
        .from('user_balances')
        .select('balance')
        .eq('user_id', user.id)
        .maybeSingle();
      setUserBalance(data?.balance ?? 0);
    };
    fetchBalance();
  }, [user]);

  const price = useMemo(() => calculatePrice(credits), [credits]);
  const ratePer100 = useMemo(() => (price / credits) * 100, [price, credits]);

  const handlePackageClick = (pkg: typeof POPULAR_PACKAGES[0]) => {
    setCredits(pkg.credits);
  };

  const handleGeneratePix = () => {
    const amount = Math.max(5, balanceAmount);
    const { payload, qrCodeUrl } = generatePixQRCode({
      pixKey: PIX_KEY,
      merchantName: PIX_NAME,
      amount,
      txId: 'SALDO',
      description: 'Adicionar Saldo',
    }, 250);
    setPixPayload(payload);
    setPixQrUrl(qrCodeUrl);
    setPixGenerated(true);
  };

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixPayload);
      setCopied(true);
      toast.success('Código PIX copiado!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Erro ao copiar');
    }
  };

  const closeBalanceModal = () => {
    setShowBalanceModal(false);
    setPixGenerated(false);
    setPixPayload('');
    setPixQrUrl('');
    setCopied(false);
    setInsufficientInfo(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-30 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundHero})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Gerador de Créditos{' '}
            <span className="text-primary">Lovable</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Escolha a quantidade, pague via PIX e seus créditos são gerados automaticamente.
          </p>
        </div>

        {/* Main card */}
        <div className="w-full max-w-2xl rounded-2xl border border-border bg-card/80 backdrop-blur-md p-6 md:p-10 space-y-8">
          {/* Credits selector */}
          <div className="space-y-5">
            <h2 className="text-xs font-bold tracking-widest text-center text-muted-foreground uppercase">
              Quantidade de Créditos
            </h2>

            <div className="flex items-center justify-center">
              <div className="rounded-xl border border-border bg-secondary/60 px-8 py-4 min-w-[160px] text-center">
                <span className="text-4xl font-black text-foreground">
                  {formatNumber(credits)}
                </span>
              </div>
            </div>

            <Slider
              value={[credits]}
              onValueChange={(v) => setCredits(v[0])}
              min={5}
              max={10000}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5</span>
              <span>10.000</span>
            </div>
          </div>

          {/* Price display */}
          <div className="rounded-xl border border-border bg-secondary/40 p-6 text-center space-y-1">
            <p className="text-4xl md:text-5xl font-black text-foreground">
              R$ {formatCurrency(price)}
            </p>
            <p className="text-sm text-muted-foreground">
              R$ {formatCurrency(ratePer100)} por cada 100 créditos
            </p>
          </div>

          {/* Popular packages */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-widest text-center text-muted-foreground uppercase">
              Pacotes Populares
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {POPULAR_PACKAGES.map((pkg) => (
                <button
                  key={pkg.credits}
                  onClick={() => handlePackageClick(pkg)}
                  className={`relative rounded-xl border p-3 text-center transition-all hover:scale-105 cursor-pointer ${
                    credits === pkg.credits
                      ? 'border-primary bg-primary/10 ring-1 ring-primary'
                      : 'border-border bg-secondary/40 hover:border-muted-foreground/40'
                  }`}
                >
                  {pkg.discount && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      {pkg.discount}
                    </span>
                  )}
                  <p className="font-bold text-sm text-foreground">
                    {formatNumber(pkg.credits)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    R$ {formatCurrency(pkg.price)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Button
            variant="hero"
            size="xl"
            className="w-full text-lg font-bold py-6 bg-primary hover:bg-primary/90"
            onClick={() => {
              if (!user) {
                toast.error('Faça login para gerar créditos');
                navigate('/authrevenda');
                return;
              }
              const needed = price - userBalance;
              if (needed > 0) {
                setInsufficientInfo({ needed, credits });
                setBalanceAmount(Math.max(5, Math.ceil(needed)));
                setShowBalanceModal(true);
              } else {
                navigate(`/checkout?credits=${credits}&price=${price.toFixed(2)}`);
              }
            }}
          >
            <Zap className="w-5 h-5" />
            Gerar {formatNumber(credits)} Créditos
          </Button>

          {/* Add Balance Button */}
          <Button
            variant="outline"
            size="xl"
            className="w-full text-base font-bold py-6 border-border bg-secondary/60 hover:bg-secondary"
            onClick={() => {
              if (!user) {
                toast.error('Faça login para adicionar saldo');
                navigate('/authrevenda');
                return;
              }
              setShowBalanceModal(true);
            }}
          >
            <Wallet className="w-5 h-5" />
            Adicionar Saldo
          </Button>
        </div>

        {/* Login link */}
        <p className="mt-6 text-sm text-muted-foreground">
          Já tem conta?{' '}
          <a href="/authrevenda" className="text-primary hover:underline font-medium">
            Entrar
          </a>
        </p>
      </div>

      {/* Add Balance Modal */}
      {showBalanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 space-y-5 relative">
            <button
              onClick={closeBalanceModal}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Adicionar Saldo
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Escaneie o QR Code ou copie o código PIX.
              </p>
            </div>

            {!pixGenerated ? (
              <div className="space-y-4">
                {insufficientInfo && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-destructive">Saldo insuficiente</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Você precisa de mais R$ {formatCurrency(insufficientInfo.needed)} para gerar {formatNumber(insufficientInfo.credits)} créditos
                      </p>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Valor (R$) — mínimo R$ 5,00
                  </label>
                  <Input
                    type="number"
                    min={5}
                    step={1}
                    value={balanceAmount}
                    onChange={(e) => setBalanceAmount(Math.max(5, Number(e.target.value)))}
                    className="text-base"
                  />
                </div>

                <Button
                  className="w-full font-bold"
                  size="lg"
                  onClick={handleGeneratePix}
                >
                  <Zap className="w-4 h-4" />
                  Gerar PIX de R$ {formatCurrency(Math.max(5, balanceAmount))}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                {/* Countdown timer */}
                <div className="flex items-center justify-center gap-2 bg-secondary/60 rounded-lg py-2 px-4">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono font-bold text-foreground">
                    {String(Math.floor(pixTimer / 60)).padStart(2, '0')}:{String(pixTimer % 60).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-muted-foreground">para pagar</span>
                </div>

                {/* Amount */}
                <p className="text-2xl font-black text-primary">
                  R$ {formatCurrency(Math.max(5, balanceAmount))}
                </p>

                {/* QR Code */}
                <div className="bg-secondary/40 rounded-xl p-4 inline-block mx-auto">
                  <img
                    src={pixQrUrl}
                    alt="QR Code PIX"
                    className="rounded-lg w-[200px] h-[200px]"
                  />
                </div>

                {/* Copy button */}
                <Button
                  className="w-full font-bold"
                  size="lg"
                  onClick={handleCopyPix}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copiado!' : 'Copiar Código PIX'}
                </Button>

                {/* Payload preview */}
                <div className="bg-secondary/40 rounded-lg px-3 py-2 overflow-hidden">
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    {pixPayload}
                  </p>
                </div>

                {/* Confirm payment button */}
                <Button
                  variant="outline"
                  className="w-full font-bold border-accent text-accent hover:bg-accent/10"
                  size="lg"
                  onClick={() => {
                    toast.success('Pagamento confirmado! Aguarde o admin creditar seu saldo.');
                    closeBalanceModal();
                  }}
                >
                  <Check className="w-4 h-4" />
                  Já fiz o pagamento
                </Button>
                <p className="text-xs text-muted-foreground">
                  Após confirmar, o saldo será adicionado pelo administrador.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditResale;
