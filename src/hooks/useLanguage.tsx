import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  pt: {
    // Header
    'header.generator': 'Painel Gerador',
    'header.create_account': 'Criar conta',
    'header.logout': 'Sair',
    'header.how_it_works': 'Como Funciona',
    'header.faq': 'FAQ',
    'header.install': 'Instalar App',
    // Cookie Banner
    'cookie.title': 'Proteção de Dados & Cookies',
    'cookie.description': 'Utilizamos cookies essenciais para o funcionamento do site e cookies analíticos para melhorar sua experiência. Seus dados são protegidos conforme a',
    'cookie.lgpd': 'Lei Geral de Proteção de Dados (LGPD)',
    'cookie.continue': 'Ao continuar navegando, você concorda com nossa',
    'cookie.privacy': 'Política de Privacidade',
    'cookie.and': 'e',
    'cookie.terms': 'Termos de Uso',
    'cookie.your_ip': 'Seu IP',
    'cookie.accept_all': 'Aceitar Todos',
    'cookie.essential_only': 'Apenas Essenciais',
    // Hero
    'hero.title': 'Créditos Infinitos na Lovable.',
    'hero.highlight': 'Simples. Rápido. Automático.',
    'hero.subtitle': 'Use nosso painel exclusivo e gere créditos ilimitados para seus projetos Lovable e revenda créditos.',
    'hero.cta': 'Comprar Agora',
    'hero.badge': 'Oferta Limitada',
    // Sections
    'features.title': 'Funcionalidades',
    'why_choose.title': 'Por que Escolher',
    'how_it_works.title': 'Como Funciona',
    'testimonials.title': 'Depoimentos',
    'guarantee.title': 'Garantia',
    'stats.title': 'Estatísticas',
    'faq.title': 'Perguntas Frequentes',
    'final_cta.title': 'Comece Agora',
    // Footer
    'footer.rights': 'Todos os direitos reservados.',
    'footer.privacy': 'Política de Privacidade',
    'footer.terms': 'Termos de Uso',
    // Language
    'lang.pt': 'Português',
    'lang.en': 'English',
  },
  en: {
    // Header
    'header.generator': 'Generator Panel',
    'header.create_account': 'Create Account',
    'header.logout': 'Logout',
    'header.how_it_works': 'How It Works',
    'header.faq': 'FAQ',
    'header.install': 'Install App',
    // Cookie Banner
    'cookie.title': 'Data Protection & Cookies',
    'cookie.description': 'We use essential cookies for site functionality and analytics cookies to improve your experience. Your data is protected according to the',
    'cookie.lgpd': 'General Data Protection Law (LGPD)',
    'cookie.continue': 'By continuing to browse, you agree to our',
    'cookie.privacy': 'Privacy Policy',
    'cookie.and': 'and',
    'cookie.terms': 'Terms of Use',
    'cookie.your_ip': 'Your IP',
    'cookie.accept_all': 'Accept All',
    'cookie.essential_only': 'Essential Only',
    // Hero
    'hero.title': 'Unlimited Credits on Lovable.',
    'hero.highlight': 'Simple. Fast. Automatic.',
    'hero.subtitle': 'Use our exclusive panel to generate unlimited credits for your Lovable projects and resell credits.',
    'hero.cta': 'Buy Now',
    'hero.badge': 'Limited Offer',
    // Sections
    'features.title': 'Features',
    'why_choose.title': 'Why Choose Us',
    'how_it_works.title': 'How It Works',
    'testimonials.title': 'Testimonials',
    'guarantee.title': 'Guarantee',
    'stats.title': 'Statistics',
    'faq.title': 'FAQ',
    'final_cta.title': 'Get Started',
    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Use',
    // Language
    'lang.pt': 'Português',
    'lang.en': 'English',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function detectLanguage(): Language {
  const saved = localStorage.getItem('app_language') as Language;
  if (saved && (saved === 'pt' || saved === 'en')) return saved;

  const browserLang = navigator.language || (navigator as any).userLanguage || '';
  return browserLang.startsWith('pt') ? 'pt' : 'en';
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(detectLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  };

  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
  }, []);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
