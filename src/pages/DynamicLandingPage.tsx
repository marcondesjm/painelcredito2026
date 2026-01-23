import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Star, Check, Shield, Clock, ArrowRight, MessageCircle, Zap, Headphones } from 'lucide-react';
import { CountdownTimer } from '@/components/CountdownTimer';
import { TrustBadge } from '@/components/TrustBadge';
import backgroundHero from '@/assets/background-hero.png';
import dashboardMockup from '@/assets/dashboard-mockup.png';

type SectionId = 'hero' | 'features' | 'about' | 'how-it-works' | 'testimonials' | 'faq' | 'cta' | 'donation';

const defaultSectionOrder: SectionId[] = [
  'hero',
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
  font_heading: string | null;
  font_body: string | null;
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

const DynamicLandingPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [page, setPage] = useState<LandingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  
  const isPreview = searchParams.get('preview') === 'true';
  const draftId = searchParams.get('draftId');

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
    if (slug) {
      fetchPage();
    }
  }, [slug]);

  const fetchPage = async () => {
    try {
      const query = supabase.from('landing_pages').select('*');

      // No editor (preview=true), permitimos carregar por ID mesmo não publicado.
      // As regras de acesso ficam protegidas pelas políticas do backend (usuário precisa ter permissão).
      const { data, error } = await (isPreview && draftId
        ? query.eq('id', draftId).single()
        : query.eq('slug', slug).eq('is_published', true).single());

      if (error) throw error;
      
      setPage({
        ...data,
        features: (data.features as { title: string; description: string }[]) || [],
        how_it_works: (data.how_it_works as { step: number; title: string; description: string }[]) || [],
        testimonials: (data.testimonials as { name: string; text: string; rating: number }[]) || [],
        faqs: (data.faqs as { question: string; answer: string }[]) || [],
        section_order: (data.section_order as SectionId[]) || defaultSectionOrder,
      });
    } catch (err) {
      console.error('Error fetching page:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page?.meta_title) {
      document.title = page.meta_title;
    }
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Página não encontrada</h1>
        <p className="text-muted-foreground mb-6">Esta página não existe ou não está publicada.</p>
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

  // Section render functions
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
              <span className="text-foreground">{(page.hero_title || page.title).split('.')[0]}. </span>
              <span className="text-gradient">{(page.hero_title || page.title).split('.').slice(1).join('.') || 'Simples. Rápido. Automático.'}</span>
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
              <TrustBadge icon={Zap} text="Entrega Automática" />
              <TrustBadge icon={Shield} text="Pagamento Seguro" />
              <TrustBadge icon={Headphones} text="Suporte Disponível" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

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
            O que você <span className="text-gradient">recebe</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {page.features.map((feature, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 p-6">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: `hsl(${primaryHsl} / 0.2)` }}
                >
                  <Check className="w-5 h-5" style={{ color: `hsl(${primaryHsl})` }} />
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
        className={`py-20 px-4 transition-all ${isPreview ? 'cursor-pointer' : ''} ${hoveredSection === 'how-it-works' ? 'ring-2 ring-primary ring-inset' : ''}`}
        onMouseEnter={() => handleSectionHover('how-it-works')}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Como <span className="text-gradient">funciona</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {page.how_it_works.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
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
            O que nossa <span className="text-gradient">comunidade</span> diz
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
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary" />
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
      className={`py-20 px-4 ${isPreview ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => handleSectionHover('cta')}
    >
      <div className="max-w-4xl mx-auto text-center">
        <div 
          className={`rounded-2xl p-8 md:p-12 border transition-shadow duration-200 ${hoveredSection === 'cta' && isPreview ? 'ring-2 ring-primary' : ''}`}
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
              <Shield className="w-4 h-4" />
              <span>Compra segura</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
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
                  href={generatePixLink(page.donation_pix_key || '', page.donation_pix_name || '')}
                  className="bg-white p-3 rounded-lg cursor-pointer hover:shadow-lg hover:scale-105 transition-all group"
                  title="Clique para abrir no app do banco"
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
                  className="text-lg font-bold font-mono cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ color: `hsl(${accentHsl})` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(page.donation_pix_key || '48996029392');
                    // Show feedback
                    const target = e.currentTarget;
                    const originalText = target.textContent;
                    target.textContent = '✓ Copiado!';
                    setTimeout(() => { target.textContent = originalText; }, 1500);
                  }}
                  title="Clique para copiar"
                >
                  {page.donation_pix_key || '48996029392'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {page.donation_pix_name || 'Marcondes Jorge Machado'}
                </p>
                
                {/* Button to open in bank app */}
                <a
                  href={generatePixLink(page.donation_pix_key || '', page.donation_pix_name || '')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 hover:scale-105"
                  style={{ backgroundColor: `hsl(${accentHsl})` }}
                >
                  <span>📱</span> Abrir no App do Banco
                </a>
                
                <p className="text-xs text-muted-foreground">Clique na chave para copiar</p>
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
    'features': renderFeaturesSection,
    'about': renderAboutSection,
    'how-it-works': renderHowItWorksSection,
    'testimonials': renderTestimonialsSection,
    'faq': renderFaqSection,
    'cta': renderCtaSection,
    'donation': renderDonationSection,
  };

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
  const generatePixLink = (pixKey: string, name: string, amount?: number) => {
    // Format for PIX copia-e-cola / QR Code
    // This creates a link that opens in banking apps
    const cleanKey = pixKey.replace(/\D/g, '');
    
    // Use the pix: URI scheme for mobile apps
    // Also provide a fallback copy functionality
    return `pix:${cleanKey}`;
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

      {/* Header with Logo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {page.logo_image ? (
            <img src={page.logo_image} alt="Logo" className="h-12 object-contain" />
          ) : (
            <h1 className="font-bold text-lg" style={{ color: `hsl(${primaryHsl})` }}>{page.title}</h1>
          )}
          <Button 
            size="sm" 
            className="text-white"
            style={{ backgroundColor: `hsl(${primaryHsl})` }}
            onClick={() => page.hero_cta_link && navigate(page.hero_cta_link)}
          >
            {page.hero_cta_text || 'Comprar Agora'}
          </Button>
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
    </div>
  );
};

export default DynamicLandingPage;
