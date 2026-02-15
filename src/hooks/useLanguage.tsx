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
    'hero.savings': 'Economia de',
    'hero.expires_in': 'EXPIRA EM',
    'hero.auto_delivery': 'Entrega Automática',
    'hero.secure_payment': 'Pagamento Seguro',
    'hero.support_available': 'Suporte Disponível',
    // Features
    'features.section_title': 'O que é o',
    'features.section_title_highlight': 'Painel',
    'features.section_subtitle': 'Uma ferramenta automatizada que gera créditos para sua conta Lovable de forma simples e rápida.',
    'features.simple_interface': 'Interface Simples',
    'features.simple_interface_desc': 'Painel intuitivo, sem complicações. Qualquer pessoa consegue usar.',
    'features.automated': '100% Automatizado',
    'features.automated_desc': 'O sistema faz todo o trabalho. Você só precisa clicar.',
    'features.unlimited': 'Créditos Ilimitados',
    'features.unlimited_desc': 'Gere quantos créditos precisar, sem limites ou restrições.',
    // Why Choose
    'why.title_pre': 'Por que',
    'why.title_highlight': 'escolher',
    'why.title_post': 'o painel?',
    'why.subtitle': 'Tudo que você precisa para usar a Lovable sem preocupações.',
    'why.b1': 'Créditos ilimitados para seus projetos',
    'why.b2': 'Interface simples e intuitiva',
    'why.b3': 'Uso imediato após a compra',
    'why.b4': 'Não exige conhecimento técnico',
    'why.b5': 'Ideal para quem usa Lovable com frequência',
    'why.b6': 'Funciona 24 horas por dia',
    'why.b7': 'Atualizações gratuitas incluídas',
    'why.b8': 'Suporte via chat disponível',
    // How It Works
    'how.title_pre': 'Como',
    'how.title_highlight': 'funciona',
    'how.subtitle': 'Processo simples em 4 passos.',
    'how.step1_title': 'Compre o Acesso',
    'how.step1_desc': 'Pagamento rápido e seguro. Acesso liberado na hora.',
    'how.step2_title': 'Entre no Painel',
    'how.step2_desc': 'Receba suas credenciais e acesse a plataforma.',
    'how.step3_title': 'Gere Créditos',
    'how.step3_desc': 'Com poucos cliques, seus créditos são gerados automaticamente.',
    'how.step4_title': 'Use na Lovable',
    'how.step4_desc': 'Aproveite seus créditos e crie projetos sem limites.',
    // Testimonials
    'testimonials.title': 'O que nossos clientes dizem',
    'testimonials.positive': 'de avaliações positivas',
    'testimonials.reviews': 'avaliações',
    'testimonials.recommends': 'Recomenda',
    'testimonials.credits': 'créditos',
    // Stats
    'stats.members': 'Membros Ativos',
    'stats.credits_min': 'Créditos gerados/min',
    'stats.satisfaction': 'Satisfação',
    // Final CTA
    'cta.title_pre': 'Pronto para ter',
    'cta.title_highlight': 'créditos infinitos',
    'cta.subtitle': 'Junte-se aos usuários que já estão aproveitando a Lovable sem limites.',
    'cta.button': 'Comprar Agora',
    // Footer
    'footer.support': 'Suporte via WhatsApp',
    'footer.clear_cache': 'Limpar Cache',
    'footer.clearing': 'Limpando...',
    'footer.rights': '© 2026 Painel Gerador de Créditos. Todos os direitos reservados.',
    'footer.version': 'Versão',
    'footer.updated': 'Atualizado em',
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
    'hero.savings': 'Save',
    'hero.expires_in': 'EXPIRES IN',
    'hero.auto_delivery': 'Auto Delivery',
    'hero.secure_payment': 'Secure Payment',
    'hero.support_available': 'Support Available',
    // Features
    'features.section_title': 'What is the',
    'features.section_title_highlight': 'Panel',
    'features.section_subtitle': 'An automated tool that generates credits for your Lovable account quickly and easily.',
    'features.simple_interface': 'Simple Interface',
    'features.simple_interface_desc': 'Intuitive panel, no complications. Anyone can use it.',
    'features.automated': '100% Automated',
    'features.automated_desc': 'The system does all the work. You just need to click.',
    'features.unlimited': 'Unlimited Credits',
    'features.unlimited_desc': 'Generate as many credits as you need, with no limits or restrictions.',
    // Why Choose
    'why.title_pre': 'Why',
    'why.title_highlight': 'choose',
    'why.title_post': 'the panel?',
    'why.subtitle': 'Everything you need to use Lovable worry-free.',
    'why.b1': 'Unlimited credits for your projects',
    'why.b2': 'Simple and intuitive interface',
    'why.b3': 'Immediate use after purchase',
    'why.b4': 'No technical knowledge required',
    'why.b5': 'Ideal for frequent Lovable users',
    'why.b6': 'Works 24 hours a day',
    'why.b7': 'Free updates included',
    'why.b8': 'Chat support available',
    // How It Works
    'how.title_pre': 'How does it',
    'how.title_highlight': 'work',
    'how.subtitle': 'Simple process in 4 steps.',
    'how.step1_title': 'Buy Access',
    'how.step1_desc': 'Fast and secure payment. Instant access.',
    'how.step2_title': 'Log In',
    'how.step2_desc': 'Receive your credentials and access the platform.',
    'how.step3_title': 'Generate Credits',
    'how.step3_desc': 'With just a few clicks, your credits are generated automatically.',
    'how.step4_title': 'Use on Lovable',
    'how.step4_desc': 'Enjoy your credits and create projects without limits.',
    // Testimonials
    'testimonials.title': 'What our customers say',
    'testimonials.positive': 'positive reviews',
    'testimonials.reviews': 'reviews',
    'testimonials.recommends': 'Recommends',
    'testimonials.credits': 'credits',
    // Stats
    'stats.members': 'Active Members',
    'stats.credits_min': 'Credits generated/min',
    'stats.satisfaction': 'Satisfaction',
    // Final CTA
    'cta.title_pre': 'Ready for',
    'cta.title_highlight': 'unlimited credits',
    'cta.subtitle': 'Join the users who are already enjoying Lovable without limits.',
    'cta.button': 'Buy Now',
    // Footer
    'footer.support': 'WhatsApp Support',
    'footer.clear_cache': 'Clear Cache',
    'footer.clearing': 'Clearing...',
    'footer.rights': '© 2026 Credits Generator Panel. All rights reserved.',
    'footer.version': 'Version',
    'footer.updated': 'Updated on',
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
