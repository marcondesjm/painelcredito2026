import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Loader2, Star, Check, Shield, Clock, ArrowRight, MessageCircle, Zap, Headphones, LogOut, Menu } from 'lucide-react';
import { CountdownTimer } from '@/components/CountdownTimer';
import { SocialProofNotification } from '@/components/SocialProofNotification';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import backgroundHero from '@/assets/background-hero.png';
import dashboardMockup from '@/assets/dashboard-mockup.png';

type SectionId = 'hero' | 'video' | 'features' | 'about' | 'how-it-works' | 'testimonials' | 'faq' | 'cta' | 'donation';

const defaultSectionOrder: SectionId[] = [
  'hero',
  'video',
  'features',
  'about',
  'how-it-works',
  'testimonials',
  'faq',
  'cta',
  'donation',
];

interface LandingPageData {
  id: string;
  slug: string;
  title: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_cta_text: string | null;
  hero_cta_link: string | null;
  hero_image: string | null;
  product_image: string | null;
  background_image: string | null;
  logo_image: string | null;
  price_original: number | null;
  price_current: number | null;
  price_installments: number | null;
  about_title: string | null;
  about_description: string | null;
  cta_title: string | null;
  cta_subtitle: string | null;
  color_primary: string | null;
  color_accent: string | null;
  color_background: string | null;
  color_text: string | null;
  color_text_highlight: string | null;
  color_icons: string | null;
  font_heading: string | null;
  font_body: string | null;
  video_enabled: boolean | null;
  video_title: string | null;
  video_url: string | null;
  video_thumbnail: string | null;
  donation_enabled: boolean | null;
  donation_title: string | null;
  donation_description: string | null;
  donation_pix_key: string | null;
  donation_pix_name: string | null;
  donation_qr_code: string | null;
  access_key: string | null;
  features: { title: string; description: string }[];
  how_it_works: { step: number; title: string; description: string }[];
  testimonials: { name: string; text: string; rating: number }[];
  faqs: { question: string; answer: string }[];
  meta_title: string | null;
  meta_description: string | null;
  facebook_pixel: string | null;
  google_analytics: string | null;
  google_tag_manager: string | null;
  tiktok_pixel: string | null;
  section_order: SectionId[] | null;
}

type BoundaryState = {
  error: Error | null;
  info: React.ErrorInfo | null;
};

class DynamicLandingPageErrorBoundary extends React.Component<
  { children: React.ReactNode },
  BoundaryState
> {
  state: BoundaryState = { error: null, info: null };

  static getDerivedStateFromError(error: Error): Partial<BoundaryState> {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Este é o ponto principal: capturar QUALQUER crash de render e registrar no console.
    // Assim a “tela preta” vira um erro rastreável.
    // eslint-disable-next-line no-console
    console.error('[DynamicLandingPage] render crash', error, info);
    this.setState({ info });
  }

  render() {
    if (!this.state.error) return this.props.children;

    const qs = new URLSearchParams(window.location.search);
    const showDebug = qs.get('debug') === 'true' || qs.get('preview') === 'true';

    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-4">
          <h1 className="text-xl font-semibold">Erro ao renderizar a landing page</h1>
          <p className="text-sm text-muted-foreground">
            Veja o console para detalhes. Se quiser detalhes na tela, abra com{' '}
            <code className="px-1 py-0.5 rounded bg-muted">?debug=true</code>.
          </p>
          <Card className="p-4 bg-card/60 border-border/50">
            <p className="text-sm font-mono whitespace-pre-wrap">{this.state.error.message}</p>
          </Card>

          {showDebug && (
            <Card className="p-4 bg-card/60 border-border/50">
              <p className="text-xs font-mono whitespace-pre-wrap">
                {this.state.error.stack || 'Sem stack disponível.'}
              </p>
              {this.state.info?.componentStack && (
                <>
                  <div className="h-px bg-border my-3" />
                  <p className="text-xs font-mono whitespace-pre-wrap">
                    {this.state.info.componentStack}
                  </p>
                </>
              )}
            </Card>
          )}
        </div>
      </div>
    );
  }
}

const DynamicLandingPageInner = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [page, setPage] = useState<LandingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  
  const isPreview = searchParams.get('preview') === 'true';
  const draftId = searchParams.get('draftId');
  const debug = searchParams.get('debug') === 'true' || isPreview;

  const handleSectionHover = (section: string) => {
    if (isPreview && window.parent !== window) {
      setHoveredSection(section);
      window.parent.postMessage({ type: 'section-hover', section }, '*');
    }
  };

  const handleSectionClick = (section: string) => {
    if (isPreview && window.parent !== window) {
      window.parent.postMessage({ type: 'section-click', section }, '*');
    }
  };

  useEffect(() => {
    if (!debug) return;
    // eslint-disable-next-line no-console
    console.debug('[DynamicLandingPage] params', { slug, isPreview, draftId });

    // eslint-disable-next-line no-console
    console.debug('[DynamicLandingPage] component types', {
      Button: typeof Button,
      Card: typeof Card,
      Accordion: typeof Accordion,
      AccordionItem: typeof AccordionItem,
      AccordionTrigger: typeof AccordionTrigger,
      AccordionContent: typeof AccordionContent,
      CountdownTimer: typeof CountdownTimer,
    });
  }, [debug, slug, isPreview, draftId]);

  useEffect(() => {
    // No modo preview, podemos carregar pelo draftId mesmo sem slug
    if (slug || (isPreview && draftId)) {
      fetchPage();
    }
  }, [slug, isPreview, draftId]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      setError(null);

      if (debug) {
        const { data: sessionData } = await supabase.auth.getSession();
        // eslint-disable-next-line no-console
        console.debug('[DynamicLandingPage] session', {
          hasSession: !!sessionData.session,
          userId: sessionData.session?.user?.id,
        });
      }

      let data = null;
      let fetchError = null;

      // No modo preview com draftId, tentamos primeiro pelo ID (para o dono da página)
      if (isPreview && draftId) {
        const result = await supabase
          .from('landing_pages')
          .select('*')
          .eq('id', draftId)
          .maybeSingle();
        
        data = result.data;
        fetchError = result.error;
        
        // Se falhou (ex: não autenticado), tenta pelo slug + publicado como fallback
        if (fetchError && slug) {
          const fallbackResult = await supabase
            .from('landing_pages')
            .select('*')
            .eq('slug', slug)
            .eq('is_published', true)
            .maybeSingle();
          
          data = fallbackResult.data;
          fetchError = fallbackResult.error;
        }
      } else if (slug) {
        // Modo normal: busca apenas páginas publicadas pelo slug
        const result = await supabase
          .from('landing_pages')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .maybeSingle();
        
        data = result.data;
        fetchError = result.error;
      }

      if (fetchError || !data) {
        const msg =
          typeof (fetchError as any)?.message === 'string'
            ? (fetchError as any).message
            : 'Page not found';
        throw new Error(msg);
      }
      
      setPage({
        ...data,
        features: (data.features as { title: string; description: string }[]) || [],
        how_it_works: (data.how_it_works as { step: number; title: string; description: string }[]) || [],
        testimonials: (data.testimonials as { name: string; text: string; rating: number }[]) || [],
        faqs: (data.faqs as { question: string; answer: string }[]) || [],
        section_order: (data.section_order as SectionId[]) || defaultSectionOrder,
      });
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      // eslint-disable-next-line no-console
      console.error('[DynamicLandingPage] fetchPage error', e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page?.meta_title) {
      document.title = page.meta_title;
    }
  }, [page]);

  // IMPORTANT: Hooks must run in the same order on every render.
  // These tracking effects must live ABOVE any conditional `return`.

  // Inject Facebook Pixel script
  useEffect(() => {
    if (page?.facebook_pixel && !isPreview) {
      const pixelContainer = document.createElement('div');
      pixelContainer.id = 'fb-pixel-container';
      pixelContainer.innerHTML = page.facebook_pixel;
      
      const scripts = pixelContainer.querySelectorAll('script');
      scripts.forEach((script) => {
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent;
        document.head.appendChild(newScript);
      });
      
      const noscripts = pixelContainer.querySelectorAll('noscript');
      noscripts.forEach((noscript) => {
        document.body.insertBefore(noscript.cloneNode(true), document.body.firstChild);
      });
      
      return () => {
        const container = document.getElementById('fb-pixel-container');
        if (container) container.remove();
      };
    }
  }, [page?.facebook_pixel, isPreview]);

  // Inject Google Analytics
  useEffect(() => {
    if (page?.google_analytics && !isPreview) {
      const gaValue = page.google_analytics.trim();
      
      // Check if it's just the ID (G-XXXXXXXXXX) or full script
      if (gaValue.startsWith('G-') && !gaValue.includes('<script')) {
        // Just the ID - create the standard GA4 script
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaValue}`;
        gaScript.id = 'ga-script-async';
        document.head.appendChild(gaScript);
        
        const gaInit = document.createElement('script');
        gaInit.id = 'ga-script-init';
        gaInit.textContent = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaValue}');
        `;
        document.head.appendChild(gaInit);
      } else {
        // Full script provided
        const container = document.createElement('div');
        container.id = 'ga-container';
        container.innerHTML = gaValue;
        
        container.querySelectorAll('script').forEach((script) => {
          const newScript = document.createElement('script');
          if (script.src) {
            newScript.src = script.src;
            newScript.async = true;
          } else {
            newScript.textContent = script.textContent;
          }
          document.head.appendChild(newScript);
        });
      }
      
      return () => {
        document.getElementById('ga-script-async')?.remove();
        document.getElementById('ga-script-init')?.remove();
        document.getElementById('ga-container')?.remove();
      };
    }
  }, [page?.google_analytics, isPreview]);

  // Inject Google Tag Manager
  useEffect(() => {
    if (page?.google_tag_manager && !isPreview) {
      const gtmValue = page.google_tag_manager.trim();
      
      // Check if it's just the ID (GTM-XXXXXXX) or full script
      if (gtmValue.startsWith('GTM-') && !gtmValue.includes('<script')) {
        // Just the ID - create the standard GTM script
        const gtmScript = document.createElement('script');
        gtmScript.id = 'gtm-script';
        gtmScript.textContent = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmValue}');
        `;
        document.head.insertBefore(gtmScript, document.head.firstChild);
        
        // Add noscript fallback
        const gtmNoscript = document.createElement('noscript');
        gtmNoscript.id = 'gtm-noscript';
        gtmNoscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmValue}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
        document.body.insertBefore(gtmNoscript, document.body.firstChild);
      } else {
        // Full script provided
        const container = document.createElement('div');
        container.id = 'gtm-container';
        container.innerHTML = gtmValue;
        
        container.querySelectorAll('script').forEach((script) => {
          const newScript = document.createElement('script');
          newScript.textContent = script.textContent;
          document.head.insertBefore(newScript, document.head.firstChild);
        });
        
        container.querySelectorAll('noscript').forEach((noscript) => {
          document.body.insertBefore(noscript.cloneNode(true), document.body.firstChild);
        });
      }
      
      return () => {
        document.getElementById('gtm-script')?.remove();
        document.getElementById('gtm-noscript')?.remove();
        document.getElementById('gtm-container')?.remove();
      };
    }
  }, [page?.google_tag_manager, isPreview]);

  // Inject TikTok Pixel
  useEffect(() => {
    if (page?.tiktok_pixel && !isPreview) {
      const ttValue = page.tiktok_pixel.trim();
      
      // Check if it's just the ID or full script
      if (/^\d+$/.test(ttValue)) {
        // Just the pixel ID - create the standard TikTok Pixel script
        const ttScript = document.createElement('script');
        ttScript.id = 'tiktok-pixel-script';
        ttScript.textContent = `
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            ttq.load('${ttValue}');
            ttq.page();
          }(window, document, 'ttq');
        `;
        document.head.appendChild(ttScript);
      } else {
        // Full script provided
        const container = document.createElement('div');
        container.id = 'tiktok-pixel-container';
        container.innerHTML = ttValue;
        
        container.querySelectorAll('script').forEach((script) => {
          const newScript = document.createElement('script');
          newScript.textContent = script.textContent;
          document.head.appendChild(newScript);
        });
      }
      
      return () => {
        document.getElementById('tiktok-pixel-script')?.remove();
        document.getElementById('tiktok-pixel-container')?.remove();
      };
    }
  }, [page?.tiktok_pixel, isPreview]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Página não encontrada</h1>
        <p className="text-muted-foreground mb-6">Esta página não existe ou não está publicada.</p>
        {debug && error?.message && (
          <Card className="max-w-2xl w-full text-left p-4 mb-6 bg-card/60 border-border/50">
            <p className="text-xs font-mono whitespace-pre-wrap">{error.message}</p>
          </Card>
        )}
        <Button onClick={() => navigate('/')}>Voltar ao início</Button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Convert hex to HSL for CSS variables
  const hexToHsl = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '0 0% 0%';
    
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;
    
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const primaryHsl = hexToHsl(page.color_primary || '#8B5CF6');
  const accentHsl = hexToHsl(page.color_accent || '#10B981');

  const fontHeading = page.font_heading || 'Inter';
  const fontBody = page.font_body || 'Inter';

  // Get the section order (use default if not set)
  const sectionOrder = page.section_order || defaultSectionOrder;

  // Generate PIX link for banking apps
  const generatePixLink = (pixKey: string) => {
    const key = (pixKey || '').trim();
    // PIX keys can be CPF/CNPJ, phone, email or random key. Do not strip non-digits.
    // Deep-link support varies by bank/app; this is best-effort.
    return key ? `pix:${key}` : '';
  };

  const isMobileDevice = () => {
    if (typeof navigator === 'undefined') return false;
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  // Copy to clipboard function
  const copyToClipboard = async (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };
  const renderHeroSection = () => (
    <section 
      key="hero"
      className={`relative min-h-screen flex items-center justify-center px-4 pt-24 pb-12 overflow-hidden transition-all ${isPreview ? 'cursor-pointer' : ''} ${hoveredSection === 'hero' ? 'ring-2 ring-primary ring-inset' : ''}`}
      onMouseEnter={() => handleSectionHover('hero')}
    >
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Product Image */}
          <div 
            className={`relative transition-all duration-200 p-2 -m-2 rounded-2xl cursor-pointer order-2 lg:order-1 ${hoveredSection === 'images' ? 'ring-4 ring-primary bg-primary/10' : ''}`}
            onMouseEnter={(e) => { e.stopPropagation(); handleSectionHover('images'); }}
            onClick={(e) => { e.stopPropagation(); handleSectionClick('images'); }}
          >
            <div className="relative animate-float">
              <img 
                src={page.product_image || dashboardMockup} 
                alt="Dashboard Preview" 
                className="w-full max-w-md lg:max-w-2xl mx-auto drop-shadow-2xl pointer-events-none"
              />
            </div>
            {hoveredSection === 'images' && isPreview && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium shadow-lg z-10">
                📸 Clique para editar
              </div>
            )}
          </div>

          {/* Right side - Content */}
          <div className="text-center lg:text-left order-1 lg:order-2">
            {/* Main heading */}
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{ fontFamily: fontHeading }}
            >
              <span style={{ color: page.color_text || '#ffffff' }}>{(page.hero_title || page.title).split('.')[0]}. </span>
              <span style={{ color: page.color_text_highlight || '#a855f7' }}>{(page.hero_title || page.title).split('.').slice(1).join('.') || 'Simples. Rápido. Automático.'}</span>
            </h1>
            
            {page.hero_subtitle && (
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                {page.hero_subtitle}
              </p>
            )}

            {/* CTA Button */}
            <div className="mb-6">
              <Button 
                size="lg" 
                className="w-full sm:w-auto min-w-[200px] text-lg px-8 text-white"
                style={{ 
                  backgroundColor: `hsl(${primaryHsl})`,
                  boxShadow: `0 0 20px hsl(${primaryHsl} / 0.4)`
                }}
                onClick={() => page.hero_cta_link && navigate(page.hero_cta_link)}
              >
                {page.hero_cta_text || 'Comprar Agora'}
              </Button>
            </div>

            {/* Limited offer badge + Price */}
            {page.price_current && (
              <div 
                className={`flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6 transition-all ${hoveredSection === 'pricing' ? 'ring-2 ring-accent ring-inset p-2 rounded-lg' : ''}`}
                onMouseEnter={(e) => { e.stopPropagation(); handleSectionHover('pricing'); }}
              >
                <span 
                  className="text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide"
                  style={{ 
                    backgroundColor: `hsl(${primaryHsl})`,
                    color: 'white'
                  }}
                >
                  Oferta Limitada
                </span>
                
                <div className="flex items-baseline gap-3">
                  {page.price_original && (
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(page.price_original)}
                    </span>
                  )}
                  <span 
                    className="text-3xl md:text-4xl font-bold"
                    style={{ color: `hsl(${accentHsl})` }}
                  >
                    {formatPrice(page.price_current)}
                  </span>
                </div>
              </div>
            )}

            {/* Countdown */}
            <div className="flex justify-center lg:justify-start mb-8">
              <CountdownTimer />
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50">
                <Zap className="w-4 h-4" style={{ color: page.color_icons || '#8B5CF6' }} />
                <span className="text-sm text-muted-foreground">Entrega Automática</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50">
                <Shield className="w-4 h-4" style={{ color: page.color_icons || '#8B5CF6' }} />
                <span className="text-sm text-muted-foreground">Pagamento Seguro</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50">
                <Headphones className="w-4 h-4" style={{ color: page.color_icons || '#8B5CF6' }} />
                <span className="text-sm text-muted-foreground">Suporte Disponível</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${url.split('/').pop()?.split('?')[0]}`;
    }
    if (url.includes('youtube.com/watch')) {
      const videoId = new URLSearchParams(url.split('?')[1]).get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
  };

  const renderVideoSection = () => {
    if (!page.video_enabled || !page.video_url) return null;
    
    const youtubeEmbedUrl = getYouTubeEmbedUrl(page.video_url);
    const isYouTube = !!youtubeEmbedUrl;

    return (
      <section 
        key="video"
        className={`py-20 px-4 transition-all ${isPreview ? 'cursor-pointer' : ''} ${hoveredSection === 'video' ? 'ring-2 ring-primary ring-inset' : ''}`}
        onMouseEnter={() => handleSectionHover('video')}
        onClick={() => handleSectionClick('video')}
      >
        <div className="max-w-4xl mx-auto">
          {page.video_title && (
            <h2 
              className="text-3xl md:text-4xl font-bold text-center mb-8"
              style={{ fontFamily: fontHeading }}
            >
              {page.video_title}
            </h2>
          )}
          
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl">
            {isYouTube ? (
              <iframe
                src={youtubeEmbedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={page.video_title || 'Video'}
              />
            ) : (
              <video 
                src={page.video_url}
                poster={page.video_thumbnail || undefined}
                controls
                className="w-full h-full object-cover"
              >
                Seu navegador não suporta vídeos.
              </video>
            )}
          </div>
        </div>
      </section>
    );
  };

  const renderFeaturesSection = () => {
    if (page.features.length === 0) return null;
    return (
      <section 
        key="features"
        className={`py-20 px-4 transition-all ${isPreview ? 'cursor-pointer' : ''} ${hoveredSection === 'features' ? 'ring-2 ring-primary ring-inset' : ''}`}
        onMouseEnter={() => handleSectionHover('features')}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            O que você <span style={{ color: page.color_text_highlight || '#a855f7' }}>recebe</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {page.features.map((feature, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 p-6">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${page.color_icons || '#8B5CF6'}20` }}
                >
                  <Check className="w-5 h-5" style={{ color: page.color_icons || '#8B5CF6' }} />
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: fontHeading }}>{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderAboutSection = () => {
    if (!page.about_title) return null;
    return (
      <section 
        key="about"
        className={`py-20 px-4 bg-card/30 transition-all ${isPreview ? 'cursor-pointer' : ''} ${hoveredSection === 'about' ? 'ring-2 ring-primary ring-inset' : ''}`}
        onMouseEnter={() => handleSectionHover('about')}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: fontHeading }}>{page.about_title}</h2>
          {page.about_description && (
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {page.about_description}
            </p>
          )}
        </div>
      </section>
    );
  };

  const renderHowItWorksSection = () => {
    if (page.how_it_works.length === 0) return null;
    return (
      <section 
        key="how-it-works"
        id="how-it-works"
        className={`py-20 px-4 transition-all ${isPreview ? 'cursor-pointer' : ''} ${hoveredSection === 'how-it-works' ? 'ring-2 ring-primary ring-inset' : ''}`}
        onMouseEnter={() => handleSectionHover('how-it-works')}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Como <span style={{ color: page.color_text_highlight || '#a855f7' }}>funciona</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {page.how_it_works.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold" style={{ backgroundColor: `${page.color_icons || '#8B5CF6'}20`, color: page.color_icons || '#8B5CF6' }}>
                  {index + 1}
                </div>
                <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderTestimonialsSection = () => {
    if (page.testimonials.length === 0) return null;
    return (
      <section 
        key="testimonials"
        className={`py-20 px-4 bg-card/30 transition-all ${isPreview ? 'cursor-pointer' : ''} ${hoveredSection === 'testimonials' ? 'ring-2 ring-primary ring-inset' : ''}`}
        onMouseEnter={() => handleSectionHover('testimonials')}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            O que nossa <span style={{ color: page.color_text_highlight || '#a855f7' }}>comunidade</span> diz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {page.testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-foreground/90 mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${page.color_icons || '#8B5CF6'}20` }}>
                    <MessageCircle className="w-5 h-5" style={{ color: page.color_icons || '#8B5CF6' }} />
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">Cliente verificado</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderFaqSection = () => {
    if (!page.faqs || page.faqs.length === 0) return null;
    return (
      <section 
        key="faq"
        id="faq"
        className={`py-20 px-4 transition-all ${isPreview ? 'cursor-pointer' : ''} ${hoveredSection === 'faq' ? 'ring-2 ring-primary ring-inset' : ''}`}
        onMouseEnter={() => handleSectionHover('faq')}
        onClick={() => handleSectionClick('faq')}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ fontFamily: fontHeading }}>
            Por que <span style={{ color: `hsl(${primaryHsl})` }}>escolher</span> o painel?
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            Tudo você precisa para usar a Lovable sem preocupações.
          </p>
          
          <Accordion type="single" collapsible className="space-y-3">
            {page.faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl px-6"
                style={{
                  '--accordion-primary': `hsl(${primaryHsl})`,
                } as React.CSSProperties}
              >
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <span className="text-foreground font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    );
  };

  const renderCtaSection = () => (
    <section 
      key="cta"
      className="py-20 px-4"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div 
          className="rounded-2xl p-8 md:p-12 border"
          style={{
            background: `linear-gradient(to right, hsl(${primaryHsl} / 0.2), hsl(${accentHsl} / 0.2))`,
            borderColor: `hsl(${primaryHsl} / 0.3)`
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: fontHeading }}>
            {page.cta_title || 'Pronto para começar?'}
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            {page.cta_subtitle || 'Garanta seu acesso agora e transforme seus resultados'}
          </p>
          
          {page.price_current && (
            <div className="mb-8">
              <p className="text-5xl font-bold" style={{ color: `hsl(${accentHsl})` }}>
                {formatPrice(page.price_current)}
              </p>
            </div>
          )}

          <Button 
            size="lg" 
            className="text-lg px-12 text-white"
            style={{ 
              backgroundColor: `hsl(${accentHsl})`,
              boxShadow: `0 0 20px hsl(${accentHsl} / 0.4)`
            }}
            onClick={() => page.hero_cta_link && navigate(page.hero_cta_link)}
          >
            {page.hero_cta_text || 'Comprar Agora'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" style={{ color: page.color_icons || '#8B5CF6' }} />
              <span>Compra segura</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: page.color_icons || '#8B5CF6' }} />
              <span>Acesso imediato</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderDonationSection = () => {
    if (page.donation_enabled === false) return null;
    return (
      <section 
        key="donation"
        className={`py-12 px-4 border-t border-border/30 transition-all relative ${isPreview ? 'cursor-pointer' : ''} ${hoveredSection === 'donation' ? 'ring-2 ring-primary ring-inset bg-primary/5' : ''}`}
        onMouseEnter={() => handleSectionHover('donation')}
        onClick={() => handleSectionClick('donation')}
      >
        {hoveredSection === 'donation' && isPreview && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium shadow-lg z-10">
            💚 Clique para editar Doação
          </div>
        )}
        <div className="max-w-2xl mx-auto text-center">
          <div 
            className="rounded-2xl p-6 border"
            style={{
              background: `linear-gradient(to right, hsl(${primaryHsl} / 0.1), hsl(${accentHsl} / 0.1))`,
              borderColor: `hsl(${primaryHsl} / 0.2)`
            }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: fontHeading }}>
              {page.donation_title || '💚 Apoie o Desenvolvedor'}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {page.donation_description || 'Gostou do sistema? Considere fazer uma doação via PIX para ajudar no desenvolvimento!'}
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              {/* QR Code */}
              {page.donation_qr_code && (
                <a 
                  href={generatePixLink(page.donation_pix_key || '')}
                  className="bg-white p-3 rounded-lg cursor-pointer hover:shadow-lg hover:scale-105 transition-all group"
                  title="Clique para abrir no app do banco"
                  onClick={async (e) => {
                    // Prevent editor click handling in preview; also provide desktop fallback.
                    e.stopPropagation();
                    const key = (page.donation_pix_key || '').trim();
                    if (!key) return;
                    if (!isMobileDevice()) {
                      e.preventDefault();
                      await copyToClipboard(key);
                    }
                  }}
                >
                  <img 
                    src={page.donation_qr_code} 
                    alt="QR Code PIX" 
                    className="w-40 h-40 object-contain"
                  />
                  <p className="text-xs text-gray-600 text-center mt-2 group-hover:text-primary transition-colors">
                    📱 Toque para abrir no app
                  </p>
                </a>
              )}
              
              {/* PIX Info */}
              <div className="bg-background/50 rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium">Chave PIX:</p>
                <p 
                  className="text-lg font-bold font-mono"
                  style={{ color: `hsl(${accentHsl})` }}
                >
                  {page.donation_pix_key || '48996029392'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {page.donation_pix_name || 'Marcondes Jorge Machado'}
                </p>
                
                {/* Button to open in bank app */}
                <a
                  href={generatePixLink(page.donation_pix_key || '')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 hover:scale-105"
                  style={{ backgroundColor: `hsl(${accentHsl})` }}
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const key = (page.donation_pix_key || '').trim();
                    if (!key) return;

                    // On desktop browsers, custom URI schemes usually won't open bank apps.
                    // In that case, we copy the key so the user can paste it in the bank app.
                    if (!isMobileDevice()) {
                      const success = await copyToClipboard(key);
                      const el = e.currentTarget;
                      const originalText = el.textContent;
                      el.textContent = success ? '✓ Chave copiada (abra seu app)' : 'Erro ao copiar';
                      setTimeout(() => {
                        el.textContent = originalText;
                      }, 1800);
                      return;
                    }

                    const uri = generatePixLink(key);
                    if (!uri) return;

                    // Best-effort: try to open bank app and also copy the key as fallback
                    window.location.href = uri;
                    await copyToClipboard(key);
                  }}
                >
                  <span>📱</span> Abrir no App do Banco
                </a>

                <p className="text-xs text-muted-foreground">
                  Dica: esse botão costuma funcionar apenas no celular. Se não abrir, use “Copiar Chave PIX”.
                </p>

                {/* Copy button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const success = await copyToClipboard(page.donation_pix_key || '48996029392', e);
                    const btn = e.currentTarget;
                    const originalText = btn.textContent;
                    btn.textContent = success ? '✓ Copiado!' : 'Erro ao copiar';
                    setTimeout(() => { btn.textContent = originalText; }, 1500);
                  }}
                >
                  📋 Copiar Chave PIX
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Map section IDs to render functions
  const sectionRenderers: Record<SectionId, () => React.ReactNode> = {
    'hero': renderHeroSection,
    'video': renderVideoSection,
    'features': renderFeaturesSection,
    'about': renderAboutSection,
    'how-it-works': renderHowItWorksSection,
    'testimonials': renderTestimonialsSection,
    'faq': renderFaqSection,
    'cta': renderCtaSection,
    'donation': renderDonationSection,
  };
  return (
    <div 
      className="min-h-screen relative"
      style={{
        '--dynamic-primary': primaryHsl,
        '--dynamic-accent': accentHsl,
        fontFamily: fontBody,
      } as React.CSSProperties}
    >
      {/* Fixed background */}
      <div 
        className="fixed inset-0 -z-20"
        style={{ 
          backgroundImage: `url(${page.background_image || backgroundHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div 
        className="fixed inset-0 -z-10" 
        style={{ backgroundColor: `${page.color_background || '#0a0a0f'}e6` }}
      />

      {/* Header with Logo and Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30 h-20 md:h-28">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {page.logo_image ? (
            <img src={page.logo_image} alt="Logo" className="h-16 md:h-24 object-contain" />
          ) : (
            <h1 className="font-bold text-lg" style={{ color: `hsl(${primaryHsl})` }}>{page.title}</h1>
          )}
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Button 
              size="sm" 
              className="text-white"
              style={{ backgroundColor: `hsl(${primaryHsl})` }}
              onClick={() => page.hero_cta_link && navigate(page.hero_cta_link)}
            >
              {page.hero_cta_text || 'Comprar Agora'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
              style={{ borderColor: `hsl(${primaryHsl} / 0.5)`, color: `hsl(${primaryHsl})` }}
              onClick={() => navigate('/auth')}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Como Funciona
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => {
                const el = document.getElementById('faq');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              FAQ
            </Button>
          </nav>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border w-[280px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Button 
                  className="w-full text-white"
                  style={{ backgroundColor: `hsl(${primaryHsl})` }}
                  onClick={() => page.hero_cta_link && navigate(page.hero_cta_link)}
                >
                  {page.hero_cta_text || 'Comprar Agora'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  style={{ borderColor: `hsl(${primaryHsl} / 0.5)`, color: `hsl(${primaryHsl})` }}
                  onClick={() => navigate('/auth')}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Como Funciona
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    const el = document.getElementById('faq');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  FAQ
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Render sections in the configured order */}
      {sectionOrder.map((sectionId) => sectionRenderers[sectionId]?.())}

      {/* Access Key Section (always at the end if exists) */}
      {page.access_key && (
        <section className="py-8 px-4 border-t border-border/30">
          <div className="max-w-xl mx-auto text-center">
            <div 
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: `hsl(${accentHsl} / 0.1)`,
                borderColor: `hsl(${accentHsl} / 0.3)`
              }}
            >
              <h3 className="text-lg font-bold mb-2" style={{ fontFamily: fontHeading }}>🔑 Chave de Acesso</h3>
              <p 
                className="text-2xl font-bold font-mono cursor-pointer hover:opacity-80 transition-opacity"
                style={{ color: `hsl(${accentHsl})` }}
                onClick={() => {
                  navigator.clipboard.writeText(page.access_key || '');
                }}
                title="Clique para copiar"
              >
                {page.access_key}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Clique para copiar a chave</p>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/30">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Social Proof Notification */}
      <SocialProofNotification />
      
      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
};

const DynamicLandingPage = () => (
  <DynamicLandingPageErrorBoundary>
    <DynamicLandingPageInner />
  </DynamicLandingPageErrorBoundary>
);

export default DynamicLandingPage;
