import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LoginModal } from './LoginModal';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { LogOut, Menu, X, Download, Globe } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/useLanguage';
import logoPainel from '@/assets/logo-painel.png';

export const Header = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { language, setLanguage, t } = useLanguage();
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
          <Link to="/" className="flex items-center h-full py-2 gap-2">
            <img src={logoPainel} alt="Painel Créditos Lovable" className="h-full max-h-[40px] sm:max-h-[48px] md:max-h-[56px] w-auto object-contain object-left" />
            <span className="text-lg sm:text-xl" role="img" aria-label={language === 'pt' ? 'Português' : 'English'}>
              {language === 'pt' ? '🇧🇷' : '🇺🇸'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            <Button 
              variant="hero" 
              size="sm"
              onClick={() => navigate('/checkout')}
            >
              {t('header.generator')}
            </Button>
            {user ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('header.logout')}
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => setLoginOpen(true)}
              >
                {t('header.create_account')}
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => scrollToSection('how-it-works')}
            >
              {t('header.how_it_works')}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => scrollToSection('faq')}
            >
              {t('header.faq')}
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                  onClick={() => navigate('/install')}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('header.install')}</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Globe className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('pt')} className={language === 'pt' ? 'bg-accent' : ''}>
                  🇧🇷 Português
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-accent' : ''}>
                  🇺🇸 English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Tablet/Medium Navigation - simplified */}
          <nav className="hidden md:flex lg:hidden items-center gap-2">
            <Button variant="hero" size="sm" onClick={() => navigate('/checkout')}>
              {t('header.generator')}
            </Button>
            {user ? (
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => setLoginOpen(true)}>
                {t('header.create_account')}
              </Button>
            )}
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => scrollToSection('how-it-works')}>
              {t('header.how_it_works')}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => scrollToSection('faq')}>
              {t('header.faq')}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Globe className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('pt')} className={language === 'pt' ? 'bg-accent' : ''}>
                  🇧🇷 Português
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-accent' : ''}>
                  🇺🇸 English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border w-[280px]">
              <div className="flex justify-center mb-6 pt-2">
                <img src={logoPainel} alt="Painel Créditos Lovable" className="h-12 w-auto object-contain" />
              </div>
              <nav className="flex flex-col gap-4">
                <Button variant="hero" className="w-full" onClick={() => handleNavigate('/checkout')}>
                  {t('header.generator')}
                </Button>
                {user ? (
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('header.logout')}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={handleOpenLogin}>
                    {t('header.create_account')}
                  </Button>
                )}
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={() => scrollToSection('how-it-works')}>
                  {t('header.how_it_works')}
                </Button>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={() => scrollToSection('faq')}>
                  {t('header.faq')}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleNavigate('/install')}>
                  <Download className="w-4 h-4 mr-2" />
                  {t('header.install')}
                </Button>
                {/* Language selector mobile */}
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button
                    variant={language === 'pt' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => { setLanguage('pt'); setMobileMenuOpen(false); }}
                  >
                    🇧🇷 PT
                  </Button>
                  <Button
                    variant={language === 'en' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => { setLanguage('en'); setMobileMenuOpen(false); }}
                  >
                    🇺🇸 EN
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
};
