import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Zap, Loader2, History, LogOut, CreditCard, X, Copy, Check, Clock, Send, User, Phone, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { createOrder, calculateCreditPrice } from '@/lib/resellerApi'
import { CreditBalance } from '@/components/credit-generator/CreditBalance'
import { generatePixQRCode } from '@/lib/pix'
import { supabase } from '@/integrations/supabase/client'

const PIX_KEY = '+5548996029392'
const PIX_NAME = 'Marcondes Jorge Machado'
const GENERATOR_PRICE = 350

function fmt(n: number) { return n.toLocaleString('pt-BR') }
function fmtR(n: number) { return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

const CreditGenerator = () => {
  const [credits, setCredits] = useState(100)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  // PIX payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [pixGenerated, setPixGenerated] = useState(false)
  const [pixPayload, setPixPayload] = useState('')
  const [pixQrUrl, setPixQrUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [pixTimer, setPixTimer] = useState(600)
  const [showConfirmForm, setShowConfirmForm] = useState(false)
  const [confirmName, setConfirmName] = useState('')
  const [confirmCpf, setConfirmCpf] = useState('')
  const [confirmPhone, setConfirmPhone] = useState('')
  const [confirmReceipt, setConfirmReceipt] = useState<File | null>(null)
  const [adminWhatsapp, setAdminWhatsapp] = useState('5548996029392')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const price = useMemo(() => calculateCreditPrice(credits), [credits])
  const ratePer100 = useMemo(() => (price / credits) * 100, [price, credits])

  // Fetch admin whatsapp
  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('key, value')
        .eq('key', 'whatsapp_number')
      if (data?.[0]?.value) setAdminWhatsapp(data[0].value)
    }
    fetchSettings()
  }, [])

  // Timer for PIX expiration
  useEffect(() => {
    if (pixGenerated) {
      setPixTimer(600)
      timerRef.current = setInterval(() => {
        setPixTimer(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [pixGenerated])

  const handleGenerate = async () => {
    if (!user) {
      toast.error('Faça login primeiro')
      navigate('/authrevenda')
      return
    }
    setLoading(true)
    try {
      const res = await createOrder(credits)
      if (res.ok) {
        toast.success('Pedido criado!')
        navigate(`/gerador/acompanhar/${res.order_id}?credits=${credits}`)
      } else {
        const msg = res.error || res.message || ''
        if (msg.toLowerCase().includes('saldo') || msg.toLowerCase().includes('balance') || msg.toLowerCase().includes('insufficient')) {
          toast.error(`Saldo insuficiente. ${msg}`)
        } else {
          toast.error(msg || 'Erro ao criar pedido')
        }
      }
    } catch {
      toast.error('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenPayment = () => {
    if (!user) {
      toast.error('Faça login primeiro')
      navigate('/authrevenda')
      return
    }
    setShowPaymentModal(true)
  }

  const handleGeneratePix = () => {
    const { payload, qrCodeUrl } = generatePixQRCode({
      pixKey: PIX_KEY,
      merchantName: PIX_NAME,
      amount: GENERATOR_PRICE,
      txId: 'GERADOR',
      description: 'Acesso Gerador',
    }, 250)
    setPixPayload(payload)
    setPixQrUrl(qrCodeUrl)
    setPixGenerated(true)
  }

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixPayload)
      setCopied(true)
      toast.success('Código PIX copiado!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Erro ao copiar')
    }
  }

  const closePaymentModal = () => {
    setShowPaymentModal(false)
    setPixGenerated(false)
    setPixPayload('')
    setPixQrUrl('')
    setCopied(false)
    setShowConfirmForm(false)
    setConfirmName('')
    setConfirmCpf('')
    setConfirmPhone('')
    setConfirmReceipt(null)
  }

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
  }

  const formatPhoneInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  const handleSendConfirmation = () => {
    if (!confirmName.trim() || !confirmCpf.trim() || !confirmPhone.trim()) {
      toast.error('Preencha todos os campos obrigatórios.')
      return
    }

    const message = `✅ *CONFIRMAÇÃO DE PAGAMENTO - GERADOR DE CRÉDITOS*

💰 *Valor:* R$ ${fmtR(GENERATOR_PRICE)}
📦 *Produto:* Acesso ao Gerador de Créditos

👤 *Dados do pagador:*
• Nome: ${confirmName.trim()}
• CPF: ${confirmCpf.trim()}
• Celular: ${confirmPhone.trim()}

${confirmReceipt ? '📎 *Comprovante:* Será enviado em seguida' : '📎 *Comprovante:* Não anexado'}

📅 *Data:* ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`

    const whatsappUrl = `https://wa.me/${adminWhatsapp}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')

    toast.success('Redirecionando para o WhatsApp...')
    closePaymentModal()
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="relative z-10 flex flex-col items-center min-h-screen px-4 py-8">
        {/* Top bar */}
        <div className="w-full max-w-2xl flex items-center justify-between mb-8">
          <CreditBalance />
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/gerador/historico')} className="text-white/70 hover:text-white">
              <History className="w-4 h-4 mr-1" /> Histórico
            </Button>
            <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate('/authrevenda?logout=1'); }} className="text-white/70 hover:text-destructive">
              <LogOut className="w-4 h-4 mr-1" /> Sair
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            Gerador de Créditos <span className="text-primary">Lovable</span>
          </h1>
          <p className="text-white/50 text-sm md:text-base">
            Selecione a quantidade e gere seus créditos instantaneamente.
          </p>
        </div>

        {/* Main card */}
        <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10 space-y-8">
          {/* Credits display */}
          <div className="space-y-5">
            <p className="text-xs font-bold tracking-widest text-center text-white/40 uppercase">
              Quantidade de Créditos
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 min-w-[180px] text-center">
                <span className="text-4xl font-black tabular-nums font-mono">{fmt(credits)}</span>
              </div>
            </div>

            <Slider
              value={[credits]}
              onValueChange={(v) => setCredits(Math.round(v[0] / 10) * 10)}
              min={10}
              max={10000}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/30">
              <span>10</span>
              <span>10.000</span>
            </div>

            {/* Direct input */}
            <div className="flex items-center justify-center gap-2">
              <Input
                type="number"
                min={10}
                max={10000}
                step={10}
                value={credits}
                onChange={(e) => {
                  let v = Math.round(Number(e.target.value) / 10) * 10
                  v = Math.max(10, Math.min(10000, v))
                  setCredits(v)
                }}
                className="w-32 text-center bg-white/5 border-white/10 text-white font-mono"
              />
            </div>
          </div>

          {/* Price */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center space-y-1">
            <p className="text-4xl md:text-5xl font-black tabular-nums font-mono">
              R$ {fmtR(price)}
            </p>
            <p className="text-sm text-white/40">
              R$ {fmtR(ratePer100)} por 100 créditos
            </p>
          </div>

          {/* Quick packages */}
          <div className="grid grid-cols-4 gap-2">
            {[100, 500, 1000, 5000].map(v => (
              <button
                key={v}
                onClick={() => setCredits(v)}
                className={`rounded-xl border p-3 text-center transition-all hover:scale-105 ${
                  credits === v
                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <p className="font-bold text-sm">{fmt(v)}</p>
                <p className="text-[10px] text-white/40">R$ {fmtR(calculateCreditPrice(v))}</p>
              </button>
            ))}
          </div>

          {/* CTA */}
          <Button
            size="xl"
            className="w-full text-lg font-bold py-6 bg-primary hover:bg-primary/90 shadow-[0_0_30px_hsl(270_100%_65%_/_0.4)] hover:shadow-[0_0_50px_hsl(270_100%_65%_/_0.6)] transition-all"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            {loading ? 'Criando pedido...' : `Gerar ${fmt(credits)} Créditos`}
          </Button>

          {/* Payment R$350 Button */}
          <Button
            size="xl"
            variant="outline"
            className="w-full text-lg font-bold py-6 border-accent/50 text-accent hover:bg-accent/10 transition-all"
            onClick={handleOpenPayment}
          >
            <CreditCard className="w-5 h-5" />
            Pagar Acesso — R$ {fmtR(GENERATOR_PRICE)}
          </Button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0a1a] p-6 space-y-5 relative">
            <button
              onClick={closePaymentModal}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Pagamento via PIX
              </h3>
              <p className="text-sm text-white/50 mt-1">
                Acesso ao Gerador de Créditos — R$ {fmtR(GENERATOR_PRICE)}
              </p>
            </div>

            {!pixGenerated ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center space-y-2">
                  <p className="text-3xl font-black text-primary">R$ {fmtR(GENERATOR_PRICE)}</p>
                  <p className="text-xs text-white/40">Pagamento único via PIX</p>
                </div>

                <Button
                  className="w-full font-bold bg-primary hover:bg-primary/90"
                  size="lg"
                  onClick={handleGeneratePix}
                >
                  <Zap className="w-4 h-4" />
                  Gerar QR Code PIX
                </Button>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                {/* Countdown timer */}
                <div className="flex items-center justify-center gap-2 bg-white/5 rounded-lg py-2 px-4">
                  <Clock className="w-4 h-4 text-white/50" />
                  <span className="font-mono font-bold text-white">
                    {String(Math.floor(pixTimer / 60)).padStart(2, '0')}:{String(pixTimer % 60).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-white/50">para pagar</span>
                </div>

                {/* Amount */}
                <p className="text-2xl font-black text-primary">
                  R$ {fmtR(GENERATOR_PRICE)}
                </p>

                {/* QR Code */}
                <div className="bg-white rounded-xl p-4 inline-block mx-auto">
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
                <div className="bg-white/5 rounded-lg px-3 py-2 overflow-hidden">
                  <p className="text-xs text-white/40 font-mono truncate">
                    {pixPayload}
                  </p>
                </div>

                {/* Confirm payment */}
                {!showConfirmForm ? (
                  <Button
                    variant="outline"
                    className="w-full font-bold border-accent/50 text-accent hover:bg-accent/10"
                    size="lg"
                    onClick={() => setShowConfirmForm(true)}
                  >
                    <Check className="w-4 h-4" />
                    Já fiz o pagamento
                  </Button>
                ) : (
                  <div className="space-y-3 bg-white/5 rounded-xl border border-white/10 p-4 text-left">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Send className="w-4 h-4 text-primary" />
                      Confirmar Pagamento
                    </h4>

                    <div className="space-y-2">
                      <Label htmlFor="gen-confirm-name" className="text-xs text-white/60 flex items-center gap-1.5">
                        <User className="w-3 h-3" /> Nome completo *
                      </Label>
                      <Input
                        id="gen-confirm-name"
                        placeholder="Seu nome completo"
                        value={confirmName}
                        onChange={(e) => setConfirmName(e.target.value)}
                        className="bg-white/5 border-white/10 text-white h-9 text-sm"
                        maxLength={100}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gen-confirm-cpf" className="text-xs text-white/60 flex items-center gap-1.5">
                        <CreditCard className="w-3 h-3" /> CPF *
                      </Label>
                      <Input
                        id="gen-confirm-cpf"
                        placeholder="000.000.000-00"
                        value={confirmCpf}
                        onChange={(e) => setConfirmCpf(formatCpf(e.target.value))}
                        className="bg-white/5 border-white/10 text-white h-9 text-sm"
                        maxLength={14}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gen-confirm-phone" className="text-xs text-white/60 flex items-center gap-1.5">
                        <Phone className="w-3 h-3" /> Celular *
                      </Label>
                      <Input
                        id="gen-confirm-phone"
                        placeholder="(00) 00000-0000"
                        value={confirmPhone}
                        onChange={(e) => setConfirmPhone(formatPhoneInput(e.target.value))}
                        className="bg-white/5 border-white/10 text-white h-9 text-sm"
                        maxLength={15}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gen-confirm-receipt" className="text-xs text-white/60 flex items-center gap-1.5">
                        <Upload className="w-3 h-3" /> Comprovante (opcional)
                      </Label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="gen-confirm-receipt"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) setConfirmReceipt(file)
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs h-9 gap-2 border-white/10 text-white/60 hover:text-white"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-3 h-3" />
                        {confirmReceipt ? confirmReceipt.name : 'Anexar comprovante'}
                      </Button>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 h-9 text-xs text-white/60"
                        onClick={() => setShowConfirmForm(false)}
                      >
                        Voltar
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 h-9 text-xs font-bold gap-1.5 bg-accent hover:bg-accent/90"
                        onClick={handleSendConfirmation}
                      >
                        <Send className="w-3 h-3" />
                        Enviar via WhatsApp
                      </Button>
                    </div>
                  </div>
                )}
                <p className="text-xs text-white/30">
                  Após confirmar, o acesso será liberado pelo administrador.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CreditGenerator