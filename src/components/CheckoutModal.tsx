import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Shield, Wallet, Link as LinkIcon, Tag, Loader2, CheckCircle, Eye, EyeOff, RefreshCw, X, Sparkles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
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
  // Checkout configuration
  showBalance?: boolean;
  balanceLabel?: string;
  securityText?: string;
  inviteEnabled?: boolean;
  inviteLabel?: string;
  invitePlaceholder?: string;
  couponEnabled?: boolean;
  couponLabel?: string;
  buttonText?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  // PIX configuration
  pixEnabled?: boolean;
  pixKey?: string;
  pixName?: string;
  pixQrBase?: string;
}

type Step = 'checkout' | 'signup' | 'success';

export const CheckoutModal = ({
  isOpen,
  onClose,
  tier,
  landingPageId,
  primaryColor = '#8B5CF6',
  accentColor = '#22C55E',
  showBalance = true,
  balanceLabel = 'Seu saldo:',
  securityText = 'Pagamento 100% seguro',
  inviteEnabled = true,
  inviteLabel = 'Link de Convite',
  invitePlaceholder = 'https://lovable.dev/invite/...',
  couponEnabled = true,
  couponLabel = 'Cupom de Desconto',
  buttonText = 'Continuar para Pagamento',
  whatsappNumber = '',
  whatsappMessage = '',
  pixEnabled = false,
  pixKey = '',
  pixName = '',
  pixQrBase = ''
}: CheckoutModalProps) => {
  const [step, setStep] = useState<Step>('checkout');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [useBalanceAsDiscount, setUseBalanceAsDiscount] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [sendLinkNow, setSendLinkNow] = useState(true);
  const [couponCode, setCouponCode] = useState('');

  // Calculate discount and final price
  const calculateDiscount = () => {
    if (!tier || !useBalanceAsDiscount || userBalance <= 0) return { discount: 0, finalPrice: tier?.price_current || 0, creditsUsed: 0 };
    
    // Each credit is worth R$ 0.10 as discount (adjust this rate as needed)
    const creditValueInReais = 0.10;
    const maxDiscountFromBalance = userBalance * creditValueInReais;
    const discount = Math.min(maxDiscountFromBalance, tier.price_current);
    const creditsUsed = Math.ceil(discount / creditValueInReais);
    const finalPrice = Math.max(0, tier.price_current - discount);
    
    return { discount, finalPrice, creditsUsed };
  };

  const { discount, finalPrice, creditsUsed } = calculateDiscount();

  const fetchBalance = useCallback(async (userId: string, showLoading = false) => {
    if (showLoading) setLoadingBalance(true);
    try {
      const { data: balanceData, error: balanceError } = await supabase
        .from('user_balances')
        .select('balance')
        .eq('user_id', userId)
        .maybeSingle();

      if (balanceError) {
        console.error('Error fetching user balance:', balanceError);
        return;
      }

      setUserBalance((balanceData?.balance as number) || 0);
    } finally {
      if (showLoading) setLoadingBalance(false);
    }
  }, []);

  const handleManualRefresh = () => {
    if (user?.id) {
      fetchBalance(user.id, true);
    }
  };

  const refreshUserContext = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const sessionUser = session?.user ?? null;
    setUser(sessionUser);

    if (!sessionUser) {
      setUserBalance(0);
      return;
    }

    // Pre-fill email
    setEmail(sessionUser.email || '');

    // Try to get profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', sessionUser.id)
      .maybeSingle();

    if (profile?.full_name) {
      setName(profile.full_name);
    }

    await fetchBalance(sessionUser.id);
  }, [fetchBalance]);

  useEffect(() => {
    if (isOpen) {
      refreshUserContext();
      setStep('checkout');

      // Keep in sync if auth state changes while the modal is open
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          const sessionUser = session?.user ?? null;
          setUser(sessionUser);

          if (sessionUser) {
            setEmail(sessionUser.email || '');
            fetchBalance(sessionUser.id);
          } else {
            setUserBalance(0);
          }
        }
      );

      return () => subscription.unsubscribe();
    }
  }, [isOpen, refreshUserContext, fetchBalance]);

  useEffect(() => {
    if (!isOpen || !user?.id) return;

    // Subscribe to realtime changes on user_balances
    const channel = supabase
      .channel(`balance-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_balances',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Realtime balance update:', payload);
          if (payload.new && 'balance' in payload.new) {
            setUserBalance((payload.new as { balance: number }).balance);
          }
        }
      )
      .subscribe();

    // Refetch when user returns to the tab/window (as fallback)
    const handleFocus = () => fetchBalance(user.id);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') fetchBalance(user.id);
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOpen, user?.id, fetchBalance]);

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
      // If using balance as discount, deduct credits first
      if (useBalanceAsDiscount && creditsUsed > 0) {
        const { error: balanceError } = await supabase.rpc('update_user_balance', {
          _user_id: user.id,
          _amount: creditsUsed,
          _type: 'debit',
          _description: `Desconto no pedido - ${tier.name}`,
          _order_id: null,
          _admin_id: null
        });

        if (balanceError) {
          console.error('Error deducting balance:', balanceError);
          toast.error('Erro ao aplicar desconto do saldo');
          setLoading(false);
          return;
        }

        // Optimistic UI + ensure sync
        setUserBalance((prev) => Math.max(0, prev - creditsUsed));
        fetchBalance(user.id);
      }

      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          landing_page_id: landingPageId,
          tier_id: tier.id,
          tier_name: tier.name,
          credits: tier.credits,
          price: finalPrice, // Use final price after discount
          customer_name: name,
          customer_whatsapp: whatsapp.replace(/\D/g, ''),
          customer_email: email,
          invite_link: sendLinkNow ? inviteLink : null,
          coupon_code: couponCode || null,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Pedido registrado! Redirecionando...');
      
      // Build WhatsApp message with order details
      const formattedPrice = formatPrice(finalPrice);
      const formattedOriginalPrice = formatPrice(tier.price_current);
      const discountText = useBalanceAsDiscount && discount > 0 
        ? `💎 *Desconto (${creditsUsed} créditos):* -${formatPrice(discount)}\n💰 *Valor Original:* ${formattedOriginalPrice}\n💰 *Valor Final:* ${formattedPrice}`
        : `💰 *Valor:* ${formattedPrice}`;
      const linkConviteText = sendLinkNow && inviteLink 
        ? `🔗 *Link de Convite:* ${inviteLink}` 
        : '⏳ *Link de Convite:* Será enviado depois';
      const cupomText = couponCode ? `🎫 *Cupom:* ${couponCode}` : '';
      
      // Use custom template if provided, otherwise use default
      let orderMessage: string;
      if (whatsappMessage) {
        orderMessage = whatsappMessage
          .replace('{pacote}', tier.name)
          .replace('{creditos}', tier.credits.toLocaleString('pt-BR'))
          .replace('{valor}', formattedPrice)
          .replace('{nome}', name)
          .replace('{whatsapp}', whatsapp)
          .replace('{email}', email)
          .replace('{link_convite}', linkConviteText)
          .replace('{cupom}', cupomText)
          .replace('{data}', new Date().toLocaleString('pt-BR'));
      } else {
        orderMessage = `🛒 *NOVO PEDIDO*

📦 *Pacote:* ${tier.name}
💳 *Créditos:* ${tier.credits.toLocaleString('pt-BR')}
${discountText}

👤 *Cliente:*
• Nome: ${name}
• WhatsApp: ${whatsapp}
• Email: ${email}

${linkConviteText}
${cupomText}

📅 *Data:* ${new Date().toLocaleString('pt-BR')}`;
      }

      // Send to WhatsApp if number is configured
      if (whatsappNumber) {
        const cleanNumber = whatsappNumber.replace(/\D/g, '');
        const encodedMessage = encodeURIComponent(orderMessage);
        window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
      }
      
      // Also redirect to checkout link if available
      if (tier.checkout_link) {
        window.open(tier.checkout_link, '_blank');
        handleClose();
      } else {
        setStep('success');
      }
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
    setUseBalanceAsDiscount(false);
    onClose();
  };

  if (!tier) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0 gap-0 border-0">
        {step === 'checkout' && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" style={{ color: primaryColor }} />
                <span className="font-semibold text-lg">Finalizar Pagamento</span>
              </div>
              <button 
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Package Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">👛</span>
                  <span className="font-medium">{tier.credits.toLocaleString('pt-BR')} Créditos</span>
                </div>
                <div className="text-right">
                  {useBalanceAsDiscount && discount > 0 ? (
                    <>
                      <span className="text-sm text-muted-foreground line-through mr-2">
                        {formatPrice(tier.price_current)}
                      </span>
                      <span className="text-2xl font-bold" style={{ color: accentColor }}>
                        {formatPrice(finalPrice)}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold" style={{ color: accentColor }}>
                      {formatPrice(tier.price_current)}
                    </span>
                  )}
                </div>
              </div>

              {/* Balance Card with Toggle */}
              {showBalance && (
                <div 
                  className="p-3 rounded-lg border-2 space-y-3"
                  style={{ borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}08` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" style={{ color: primaryColor }} />
                      <span className="text-sm font-medium">{balanceLabel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {loadingBalance ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                      ) : (
                        <span className="text-sm font-bold" style={{ color: accentColor }}>
                          {userBalance.toLocaleString('pt-BR')} créditos
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={handleManualRefresh}
                        disabled={loadingBalance}
                        className="p-1 rounded-md hover:bg-background/50 transition-colors disabled:opacity-50"
                        title="Atualizar saldo"
                      >
                        <RefreshCw 
                          className={`w-3.5 h-3.5 ${loadingBalance ? 'animate-spin' : ''}`} 
                          style={{ color: primaryColor }} 
                        />
                      </button>
                    </div>
                  </div>
                  
                  {/* Use balance as discount toggle */}
                  {userBalance > 0 && (
                    <div 
                      className="flex items-center justify-between p-2.5 rounded-lg"
                      style={{ backgroundColor: useBalanceAsDiscount ? `${accentColor}15` : 'transparent' }}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" style={{ color: useBalanceAsDiscount ? accentColor : '#888' }} />
                        <span className="text-sm font-medium">Usar créditos como desconto</span>
                      </div>
                      <Switch
                        checked={useBalanceAsDiscount}
                        onCheckedChange={setUseBalanceAsDiscount}
                      />
                    </div>
                  )}
                  
                  {/* Discount summary */}
                  {useBalanceAsDiscount && discount > 0 && (
                    <div className="pt-2 border-t border-border/30 space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Créditos usados:</span>
                        <span className="font-medium">{creditsUsed.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Desconto:</span>
                        <span className="font-medium text-green-500">-{formatPrice(discount)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Saldo restante:</span>
                        <span className="font-medium">{(userBalance - creditsUsed).toLocaleString('pt-BR')} créditos</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Security Badge */}
              <div 
                className="flex items-center justify-center gap-2 py-2.5 rounded-full border"
                style={{ borderColor: `${accentColor}40`, backgroundColor: `${accentColor}10` }}
              >
                <RefreshCw className="w-4 h-4" style={{ color: accentColor }} />
                <span className="text-sm font-medium" style={{ color: accentColor }}>
                  {securityText}
                </span>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Nome Completo</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="João Silva"
                    className="bg-background border-2 h-11"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">WhatsApp</Label>
                    <Input
                      value={whatsapp}
                      onChange={handleWhatsappChange}
                      placeholder="(11) 99999-9999"
                      className="bg-background border-2 h-11"
                      maxLength={16}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="bg-background border-2 h-11"
                    />
                  </div>
                </div>

                {/* Invite Link Section */}
                {inviteEnabled && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" style={{ color: primaryColor }} />
                      <span className="text-sm font-medium">{inviteLabel}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={sendLinkNow ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSendLinkNow(true)}
                        className="h-10 font-medium"
                        style={sendLinkNow ? { backgroundColor: '#F59E0B', color: 'white' } : {}}
                      >
                        Enviar agora
                      </Button>
                      <Button
                        type="button"
                        variant={!sendLinkNow ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSendLinkNow(false)}
                        className="h-10 font-medium"
                        style={!sendLinkNow ? { backgroundColor: '#6B7280', color: 'white' } : {}}
                      >
                        Enviar depois
                      </Button>
                    </div>

                    {sendLinkNow && (
                      <Input
                        value={inviteLink}
                        onChange={(e) => setInviteLink(e.target.value)}
                        placeholder={invitePlaceholder}
                        className="bg-background border-2 h-11 text-sm"
                      />
                    )}
                  </div>
                )}

                {/* Coupon */}
                {couponEnabled && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" style={{ color: '#F59E0B' }} />
                      <span className="text-sm font-medium">{couponLabel}</span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Digite o cupom"
                        className="bg-background border-2 h-11 flex-1"
                      />
                      <Button 
                        variant="outline" 
                        className="h-11 px-4 font-medium"
                        disabled={!couponCode}
                      >
                        Aplicar
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* PIX Payment Section */}
              {pixEnabled && pixKey && (
                <div className="p-4 rounded-lg border-2 space-y-4" style={{ borderColor: `${accentColor}40`, backgroundColor: `${accentColor}08` }}>
                  <div className="text-center">
                    <h3 className="font-semibold text-sm mb-1">💳 Pague via PIX</h3>
                    <p className="text-xs text-muted-foreground">Escaneie o QR Code ou copie a chave</p>
                  </div>
                  
                  {/* QR Code */}
                  <div className="flex justify-center">
                    <div className="bg-white p-3 rounded-lg shadow-md">
                      <img 
                        src={pixQrBase || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(pixKey)}`}
                        alt="QR Code PIX"
                        className="w-32 h-32 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(pixKey)}`;
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* PIX Info */}
                  <div className="space-y-2">
                    {pixName && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Beneficiário:</span>
                        <span className="font-medium">{pixName}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Valor:</span>
                      <span className="font-bold text-base" style={{ color: accentColor }}>
                        {formatPrice(finalPrice)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Copy PIX Key Button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      navigator.clipboard.writeText(pixKey);
                      toast.success('Chave PIX copiada!');
                    }}
                  >
                    📋 Copiar Chave PIX
                  </Button>
                </div>
              )}

              {/* Submit Button */}
              <Button
                className="w-full h-12 text-white font-semibold text-base"
                style={{ backgroundColor: primaryColor }}
                onClick={handleSubmitOrder}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  buttonText
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'signup' && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-sm">💎</span>
                </div>
                <span className="font-semibold" style={{ color: primaryColor }}>CreditoPro</span>
              </div>
              <button 
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <p className="text-sm text-center text-muted-foreground">Criar sua conta</p>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Nome completo</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="João Silva"
                  className="bg-background border-2 h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">WhatsApp</Label>
                <Input
                  value={whatsapp}
                  onChange={handleWhatsappChange}
                  placeholder="(00) 00000-0000"
                  className="bg-background border-2 h-11"
                  maxLength={16}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">E-mail</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="bg-background border-2 h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Senha</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-background border-2 h-11 pr-10"
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
                <Label className="text-sm font-medium" style={{ color: primaryColor }}>
                  Link de convite (opcional)
                </Label>
                <Input
                  value={inviteLink}
                  onChange={(e) => setInviteLink(e.target.value)}
                  placeholder="Cole o link de convite aqui"
                  className="bg-background border-2 h-11"
                />
              </div>

              <Button
                className="w-full h-12 text-white font-semibold text-base"
                style={{ backgroundColor: '#F59E0B' }}
                onClick={handleSignup}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar conta'
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <button 
                  className="underline hover:text-foreground font-medium"
                  style={{ color: primaryColor }}
                  onClick={() => {
                    window.location.href = '/auth';
                  }}
                >
                  Fazer login
                </button>
              </p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-6">
            <div className="py-8 text-center space-y-4">
              <div className="flex justify-center">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <CheckCircle className="w-12 h-12" style={{ color: accentColor }} />
                </div>
              </div>
              <h3 className="text-2xl font-bold">Pedido Enviado!</h3>
              <p className="text-muted-foreground">
                Recebemos seu pedido de <strong>{tier.credits.toLocaleString('pt-BR')}</strong> créditos.<br />
                Você receberá instruções de pagamento em breve.
              </p>
              <Button 
                onClick={handleClose} 
                variant="outline"
                className="h-11 px-6"
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
