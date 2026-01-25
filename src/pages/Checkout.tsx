import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Shield, Zap, Headphones, Check, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import productPainel from '@/assets/product-painel.png';

const Checkout = () => {
  const [email, setEmail] = useState('');

  const benefits = [
    "Acesso Vitalício ao Painel",
    "Gerador de Créditos Ilimitado",
    "Suporte Premium 24/7",
    "Atualizações Gratuitas",
    "Comunidade Exclusiva"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with payment gateway
    const whatsappMessage = encodeURIComponent(`Olá! Gostaria de comprar o Painel Gerador de Créditos. Meu email: ${email}`);
    window.open(`https://wa.me/5548996029392?text=${whatsappMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30 bg-background/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Info */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
            <div className="flex gap-4 mb-6">
              <img 
                src={productPainel} 
                alt="Painel Gerador" 
                className="w-40 h-28 object-cover rounded-xl border border-border/50"
              />
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Painel Gerador de Créditos
                </h1>
                <p className="text-lg font-semibold text-foreground">Acesso Completo</p>
                <p className="text-sm text-muted-foreground">Acesso vitalício • Sem mensalidades</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-muted-foreground line-through text-sm">R$ 600,00</span>
                  <span className="text-2xl font-bold text-accent">R$ 349,99</span>
                  <span className="bg-accent/20 text-accent text-xs px-2 py-0.5 rounded-full">
                    Economia de 40%
                  </span>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-primary" />
                Compra Segura
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-primary" />
                Entrega Automática
              </div>
              <div className="flex items-center gap-1">
                <Headphones className="w-4 h-4 text-primary" />
                Suporte 24h
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">O que você vai receber:</h3>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-accent" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  Seu Email
                </label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background border-border"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  O acesso será enviado para este email
                </p>
              </div>

              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-background/50 p-3 rounded-lg">
                <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Seus dados estão protegidos • Acesso liberado automaticamente</span>
              </div>

              <Button type="submit" variant="hero" size="xl" className="w-full">
                COMPRAR AGORA
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Já é cliente?{' '}
                <Link to="/" className="text-primary hover:underline">
                  Clique aqui para acessar o painel
                </Link>
              </p>

              <p className="text-center text-xs text-muted-foreground">
                Ao comprar, você concorda com nossos{' '}
                <Link to="/termos" className="text-primary hover:underline">Termos de Uso</Link>
                {' '}e{' '}
                <Link to="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
