import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Shield, Wallet, Link as LinkIcon, Tag, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PricingTier } from './PricingTiersSection';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: PricingTier | null;
  landingPageId: string;
  primaryColor?: string;
  accentColor?: string;
}

type Step = 'checkout' | 'signup' | 'success';

export const CheckoutModal = ({
  isOpen,
  onClose,
  tier,
  landingPageId,
  primaryColor = '#8B5CF6',
  accentColor = '#22C55E'
}: CheckoutModalProps) => {
  const [step, setStep] = useState<Step>('checkout');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [sendLinkNow, setSendLinkNow] = useState(true);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user) {
        // Pre-fill email
        setEmail(session.user.email || '');
        
        // Try to get profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (profile?.full_name) {
          setName(profile.full_name);
        }
      }
    };
    
    if (isOpen) {
      checkUser();
      setStep('checkout');
    }
  }, [isOpen]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatWhatsapp = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as (XX) XXXXX-XXXX
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhatsapp(formatWhatsapp(e.target.value));
  };

  const handleSignup = async () => {
    if (!name || !whatsapp || !email || !password) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Este email já está cadastrado. Faça login.');
          return;
        }
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        setStep('checkout');
        toast.success('Conta criada com sucesso!');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOrder = async () => {
    if (!tier) return;
    
    if (!name || !whatsapp || !email) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // If not logged in, go to signup
    if (!user) {
      setStep('signup');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          landing_page_id: landingPageId,
          tier_id: tier.id,
          tier_name: tier.name,
          credits: tier.credits,
          price: tier.price_current,
          customer_name: name,
          customer_whatsapp: whatsapp.replace(/\D/g, ''),
          customer_email: email,
          invite_link: sendLinkNow ? inviteLink : null,
          coupon_code: couponCode || null,
          status: 'pending'
        });

      if (error) throw error;

      setStep('success');
      toast.success('Pedido enviado com sucesso!');
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(error.message || 'Erro ao enviar pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('checkout');
    setName('');
    setWhatsapp('');
    setEmail('');
    setPassword('');
    setInviteLink('');
    setCouponCode('');
    onClose();
  };

  if (!tier) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        {step === 'checkout' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" style={{ color: primaryColor }} />
                Finalizar Pagamento
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Package Info */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👛</span>
                  <span className="font-medium">{tier.credits} Créditos</span>
                </div>
                <span className="text-xl font-bold" style={{ color: accentColor }}>
                  {formatPrice(tier.price_current)}
                </span>
              </div>

              {/* Balance */}
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Seu saldo:</span>
                </div>
                <span className="text-sm font-medium">R$ 0,00</span>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 py-2">
                <Shield className="w-4 h-4" style={{ color: accentColor }} />
                <span className="text-sm text-muted-foreground">Pagamento 100% seguro</span>
              </div>

              {/* Form */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-sm">Nome Completo</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="João Silva"
                    className="bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm">WhatsApp</Label>
                    <Input
                      value={whatsapp}
                      onChange={handleWhatsappChange}
                      placeholder="(11) 99999-9999"
                      className="bg-background"
                      maxLength={16}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm">Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="bg-background"
                    />
                  </div>
                </div>

                {/* Invite Link Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" style={{ color: primaryColor }} />
                    <span className="text-sm font-medium">Link de Convite</span>
                    <Badge variant="outline" className="text-xs">Opcional</Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={sendLinkNow ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSendLinkNow(true)}
                      style={sendLinkNow ? { backgroundColor: primaryColor } : {}}
                    >
                      Enviar agora
                    </Button>
                    <Button
                      type="button"
                      variant={!sendLinkNow ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSendLinkNow(false)}
                    >
                      Enviar depois
                    </Button>
                  </div>

                  {sendLinkNow && (
                    <Input
                      value={inviteLink}
                      onChange={(e) => setInviteLink(e.target.value)}
                      placeholder="https://lovable.dev/invite/..."
                      className="bg-background text-sm"
                    />
                  )}
                </div>

                {/* Coupon */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" style={{ color: accentColor }} />
                    <span className="text-sm font-medium">Cupom de Desconto</span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Digite o cupom"
                      className="bg-background flex-1"
                    />
                    <Button variant="outline" size="sm" disabled>
                      Aplicar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                className="w-full text-white font-semibold"
                style={{ backgroundColor: primaryColor }}
                onClick={handleSubmitOrder}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Continuar para Pagamento'
                )}
              </Button>
            </div>
          </>
        )}

        {step === 'signup' && (
          <>
            <DialogHeader className="text-center">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-xl">💎</span>
                </div>
              </div>
              <DialogTitle className="text-center" style={{ color: primaryColor }}>
                CreditoPro
              </DialogTitle>
              <p className="text-sm text-muted-foreground">Criar sua conta</p>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Nome completo</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="João Silva"
                  className="bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">WhatsApp</Label>
                <Input
                  value={whatsapp}
                  onChange={handleWhatsappChange}
                  placeholder="(00) 00000-0000"
                  className="bg-background"
                  maxLength={16}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">E-mail</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">Senha</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-background pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm" style={{ color: primaryColor }}>
                  Link de convite (opcional)
                </Label>
                <Input
                  value={inviteLink}
                  onChange={(e) => setInviteLink(e.target.value)}
                  placeholder="Cole o link de convite aqui"
                  className="bg-background"
                />
              </div>

              <Button
                className="w-full text-white font-semibold"
                style={{ backgroundColor: '#F59E0B' }}
                onClick={handleSignup}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar conta'
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Já tem uma conta?{' '}
                <button 
                  className="underline hover:text-foreground"
                  style={{ color: primaryColor }}
                  onClick={() => {
                    // Could redirect to login
                    window.location.href = '/auth';
                  }}
                >
                  Fazer login
                </button>
              </p>
            </div>
          </>
        )}

        {step === 'success' && (
          <div className="py-8 text-center space-y-4">
            <div className="flex justify-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <CheckCircle className="w-10 h-10" style={{ color: accentColor }} />
              </div>
            </div>
            <h3 className="text-xl font-bold">Pedido Enviado!</h3>
            <p className="text-muted-foreground text-sm">
              Recebemos seu pedido de {tier.credits} créditos.<br />
              Você receberá instruções de pagamento em breve.
            </p>
            <Button onClick={handleClose} variant="outline">
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
