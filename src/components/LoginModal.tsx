import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard/new`
          }
        });
        if (error) throw error;
        
        // If user is auto-confirmed, redirect to editor
        if (data.user && data.session) {
          toast({
            title: "Conta criada!",
            description: "Bem-vindo! Vamos criar sua primeira página.",
          });
          onOpenChange(false);
          navigate('/dashboard/new');
        } else {
          toast({
            title: "Conta criada!",
            description: "Verifique seu email para confirmar a conta.",
          });
          setIsSignUp(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Check if user is admin
        const { data: roleData } = await supabase.rpc('has_role', {
          _user_id: data.user.id,
          _role: 'admin'
        });
        
        toast({
          title: "Login realizado!",
          description: "Bem-vindo de volta.",
        });
        onOpenChange(false);
        
        // Redirect admin to admin dashboard, regular users to dashboard
        if (roleData === true) {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      let errorMessage = error.message || "Ocorreu um erro. Tente novamente.";
      
      // Handle common error messages with better Portuguese translations
      if (error.message?.includes("User already registered")) {
        errorMessage = "Este email já está cadastrado. Faça login em vez de criar conta.";
        setIsSignUp(false); // Switch to login mode
      } else if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Email ou senha incorretos. Verifique seus dados.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md bg-card border-border mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-foreground">
            Área de Membros
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-background border-border"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-muted-foreground">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-background border-border"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            variant="hero" 
            className="w-full"
            disabled={isLoading}
          >
            <LogIn className="w-4 h-4 mr-2" />
            {isLoading ? 'Carregando...' : isSignUp ? 'Criar Conta' : 'Entrar'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline"
            >
              {isSignUp ? 'Faça login' : 'Adquira seu acesso'}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
