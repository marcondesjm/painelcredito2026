import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LoginModal } from './LoginModal';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { LogOut, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import logoPainel from '@/assets/logo-dashboard.png';

export const Header = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigate = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const handleOpenLogin = () => {
    setMobileMenuOpen(false);
    setLoginOpen(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30 h-16 sm:h-18 md:h-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 h-full py-1">
            <img src={logoPainel} alt="Painel Créditos Lovable" className="h-12 sm:h-14 md:h-16 object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            <Button 
              variant="hero" 
              size="sm"
              onClick={() => navigate('/checkout')}
            >
              Painel Gerador
            </Button>
            {user ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => setLoginOpen(true)}
              >
                Área de Membros
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => scrollToSection('how-it-works')}
            >
              Como Funciona
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => scrollToSection('faq')}
            >
              FAQ
            </Button>
          </nav>

          {/* Tablet/Medium Navigation - simplified */}
          <nav className="hidden md:flex lg:hidden items-center gap-2">
            <Button 
              variant="hero" 
              size="sm"
              onClick={() => navigate('/checkout')}
            >
              Painel Gerador
            </Button>
            {user ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => setLoginOpen(true)}
              >
                Entrar
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => scrollToSection('how-it-works')}
            >
              Como Funciona
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => scrollToSection('faq')}
            >
              FAQ
            </Button>
          </nav>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border w-[280px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Button 
                  variant="hero" 
                  className="w-full"
                  onClick={() => handleNavigate('/checkout')}
                >
                  Painel Gerador
                </Button>
                {user ? (
                  <Button 
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={handleOpenLogin}
                  >
                    Área de Membros
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => scrollToSection('how-it-works')}
                >
                  Como Funciona
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => scrollToSection('faq')}
                >
                  FAQ
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
};
