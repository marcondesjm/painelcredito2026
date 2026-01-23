import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2, ExternalLink, Sparkles, Plus, Trash2, Eye, EyeOff, GripVertical, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ImageUpload';
import { EditorTour } from '@/components/EditorTour';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { SectionOrderManager, SectionId, defaultSectionOrder } from '@/components/SectionOrderManager';

interface LandingPageData {
  id?: string;
  slug: string;
  title: string;
  is_published: boolean;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_cta_link: string;
  hero_image: string;
  product_image: string;
  background_image: string;
  logo_image: string;
  price_original: number | null;
  price_current: number | null;
  price_installments: number;
  about_title: string;
  about_description: string;
  cta_title: string;
  cta_subtitle: string;
  color_primary: string;
  color_accent: string;
  color_background: string;
  font_heading: string;
  font_body: string;
  donation_enabled: boolean;
  donation_title: string;
  donation_description: string;
  donation_pix_key: string;
  donation_pix_name: string;
  donation_qr_code: string;
  access_key: string;
  features: { title: string; description: string; icon?: string }[];
  how_it_works: { step: number; title: string; description: string; image?: string }[];
  testimonials: { name: string; text: string; rating: number; avatar?: string }[];
  faqs: { question: string; answer: string }[];
  meta_title: string;
  meta_description: string;
  og_image: string;
  section_order: SectionId[];
}

const fontOptions = [
  { name: 'Inter', value: 'Inter', style: 'font-sans' },
  { name: 'Poppins', value: 'Poppins', style: 'font-sans' },
  { name: 'Montserrat', value: 'Montserrat', style: 'font-sans' },
  { name: 'Roboto', value: 'Roboto', style: 'font-sans' },
  { name: 'Open Sans', value: 'Open Sans', style: 'font-sans' },
  { name: 'Playfair Display', value: 'Playfair Display', style: 'font-serif' },
  { name: 'Lora', value: 'Lora', style: 'font-serif' },
  { name: 'Merriweather', value: 'Merriweather', style: 'font-serif' },
  { name: 'Oswald', value: 'Oswald', style: 'font-sans' },
  { name: 'Raleway', value: 'Raleway', style: 'font-sans' },
  { name: 'Bebas Neue', value: 'Bebas Neue', style: 'font-sans' },
  { name: 'Anton', value: 'Anton', style: 'font-sans' },
  { name: 'Space Grotesk', value: 'Space Grotesk', style: 'font-sans' },
  { name: 'DM Sans', value: 'DM Sans', style: 'font-sans' },
  { name: 'Outfit', value: 'Outfit', style: 'font-sans' },
];

const colorPalettes = [
  { name: 'Roxo & Verde', primary: '#8B5CF6', accent: '#10B981', background: '#0a0a0f' },
  { name: 'Azul & Laranja', primary: '#3B82F6', accent: '#F97316', background: '#0a0a0f' },
  { name: 'Rosa & Azul', primary: '#EC4899', accent: '#06B6D4', background: '#0a0a0f' },
  { name: 'Verde & Amarelo', primary: '#22C55E', accent: '#EAB308', background: '#0a0a0f' },
  { name: 'Vermelho & Dourado', primary: '#EF4444', accent: '#F59E0B', background: '#0a0a0f' },
  { name: 'Ciano & Magenta', primary: '#06B6D4', accent: '#D946EF', background: '#0a0a0f' },
];

const defaultData: LandingPageData = {
  slug: '',
  title: 'Nova Landing Page',
  is_published: false,
  hero_title: 'Acesse o Painel de Créditos Lovable',
  hero_subtitle: 'Sistema completo para gerenciamento de créditos. Tenha controle total sobre suas finanças com nossa plataforma intuitiva.',
  hero_cta_text: 'QUERO MEU ACESSO AGORA',
  hero_cta_link: '',
  hero_image: '',
  product_image: '',
  background_image: '',
  logo_image: '',
  price_original: 297,
  price_current: 47,
  price_installments: 12,
  about_title: 'Sobre o Sistema',
  about_description: 'O Painel de Créditos é a ferramenta definitiva para quem deseja ter controle total sobre suas finanças. Com interface intuitiva e recursos avançados, você terá tudo que precisa para gerenciar seus créditos de forma eficiente.',
  cta_title: 'Não perca essa oportunidade!',
  cta_subtitle: 'Garanta seu acesso agora mesmo com desconto exclusivo',
  color_primary: '#8B5CF6',
  color_accent: '#10B981',
  color_background: '#0a0a0f',
  font_heading: 'Inter',
  font_body: 'Inter',
  donation_enabled: true,
  donation_title: '💚 Apoie o Desenvolvedor',
  donation_description: 'Gostou do sistema? Considere fazer uma doação via PIX para ajudar no desenvolvimento!',
  donation_pix_key: '48996029392',
  donation_pix_name: 'Marcondes Jorge Machado',
  donation_qr_code: '',
  access_key: '',
  features: [
    { title: 'Dashboard Completo', description: 'Visualize todos os seus créditos em um painel intuitivo e organizado.' },
    { title: 'Relatórios Detalhados', description: 'Gere relatórios completos sobre suas movimentações financeiras.' },
    { title: 'Acesso Vitalício', description: 'Pague uma vez e tenha acesso para sempre, sem mensalidades.' },
    { title: 'Suporte Premium', description: 'Tire suas dúvidas com nossa equipe de suporte especializada.' },
    { title: 'Atualizações Grátis', description: 'Receba todas as melhorias e novos recursos automaticamente.' },
    { title: 'Interface Moderna', description: 'Design moderno e responsivo que funciona em qualquer dispositivo.' },
  ],
  how_it_works: [
    { step: 1, title: 'Faça seu cadastro', description: 'Crie sua conta em poucos segundos e acesse o painel.' },
    { step: 2, title: 'Configure seu perfil', description: 'Personalize suas preferências e configure suas metas.' },
    { step: 3, title: 'Comece a usar', description: 'Aproveite todos os recursos e transforme sua gestão.' },
  ],
  testimonials: [
    { name: 'Maria Silva', text: 'Simplesmente incrível! O sistema mudou completamente a forma como gerencio meus créditos.', rating: 5 },
    { name: 'João Santos', text: 'Interface super intuitiva e fácil de usar. Recomendo para todos!', rating: 5 },
    { name: 'Ana Costa', text: 'Melhor investimento que fiz. O suporte é excelente e o sistema é muito completo.', rating: 5 },
  ],
  faqs: [
    { question: 'Como funciona para gerar os créditos?', answer: 'É bem simples! Você precisa copiar o link de convite da conta que deseja depositar os créditos e enviar esse link no nosso painel. Depois, selecione a quantidade de créditos desejada e seus créditos serão depositados automaticamente.' },
    { question: 'Como eu sei se funciona mesmo e não é golpe?', answer: 'Você pode pedir para nós enviarmos créditos para você para que você veja os resultados e o funcionamento por conta própria. Clique aqui para pedir uma demonstração.' },
    { question: 'Como funciona o acesso ao produto?', answer: 'Após a confirmação do pagamento, será criado automaticamente um login utilizando o e-mail cadastrado na compra. Com esse login, você poderá acessar o painel diretamente pelo nosso site, na aba Painel. O acesso é liberado de forma automática e imediata.' },
    { question: 'Tem tutorial por vídeo e manual de acesso?', answer: 'Sim! Temos tutorial em vídeo e manual de acesso completo. Clique aqui para acessar a página de tutorial.' },
    { question: 'Por quanto tempo terei acesso?', answer: 'Você terá acesso vitalício ao painel, incluindo todas as atualizações futuras sem custo adicional.' },
    { question: 'Quais sistemas operacionais o programa funciona?', answer: 'O painel funciona 100% online, direto no navegador. Acesse de qualquer dispositivo (Windows, Mac, Linux, Android, iOS).' },
    { question: 'Tem limite de resgate de créditos?', answer: 'Não há limite de resgates. Você pode gerar quantos créditos quiser, sem restrições.' },
    { question: 'Está funcionando depois da atualização do Lovable?', answer: 'Sim, está funcionando depois do fix que a Lovable deu no método antigo das extensões que clicavam publish ao mesmo tempo. Nosso painel utiliza métodos diferentes e atualizados.' },
    { question: 'Funciona em uma conta que já indicou mais de 10 convites?', answer: 'Sim! Você pode resgatar créditos em uma conta que já indicou mais de 10 pessoas, desde que você tenha acesso a uma conta que já resgatou créditos nessa conta, então você pode depositar na conta desejada.' },
  ],
  meta_title: '',
  meta_description: '',
  og_image: '',
  section_order: defaultSectionOrder,
};

const LandingPageEditor = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<LandingPageData>(defaultData);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [activeTab, setActiveTab] = useState('basico');
  const [creatingDraft, setCreatingDraft] = useState(false);
  const draftCreatedRef = useRef(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadRef = useRef(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewKey, setPreviewKey] = useState(0);

  const refreshPreview = () => {
    setPreviewKey(prev => prev + 1);
  };

  // Panel size persistence
  const PANEL_SIZE_KEY = 'editor-panel-sizes';
  const getStoredPanelSizes = (): number[] | undefined => {
    try {
      const stored = localStorage.getItem(PANEL_SIZE_KEY);
      if (stored) {
        const sizes = JSON.parse(stored);
        if (Array.isArray(sizes) && sizes.length === 2) {
          return sizes;
        }
      }
    } catch {
      // ignore parse errors
    }
    return undefined;
  };
  const storedSizes = getStoredPanelSizes();
  const defaultEditorSize = storedSizes?.[0] ?? 40;
  const defaultPreviewSize = storedSizes?.[1] ?? 60;

  const handlePanelResize = (sizes: number[]) => {
    try {
      localStorage.setItem(PANEL_SIZE_KEY, JSON.stringify(sizes));
    } catch {
      // ignore storage errors
    }
  };

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const buildPayload = (draft: LandingPageData) => ({
    user_id: user?.id,
    slug: draft.slug,
    title: draft.title,
    is_published: draft.is_published,
    hero_title: draft.hero_title || null,
    hero_subtitle: draft.hero_subtitle || null,
    hero_cta_text: draft.hero_cta_text || 'Comprar Agora',
    hero_cta_link: draft.hero_cta_link || null,
    hero_image: draft.hero_image || null,
    product_image: draft.product_image || null,
    background_image: draft.background_image || null,
    logo_image: draft.logo_image || null,
    price_original: draft.price_original,
    price_current: draft.price_current,
    price_installments: draft.price_installments,
    about_title: draft.about_title || null,
    about_description: draft.about_description || null,
    cta_title: draft.cta_title || null,
    cta_subtitle: draft.cta_subtitle || null,
    color_primary: draft.color_primary || '#8B5CF6',
    color_accent: draft.color_accent || '#10B981',
    color_background: draft.color_background || '#0a0a0f',
    font_heading: draft.font_heading || 'Inter',
    font_body: draft.font_body || 'Inter',
    donation_enabled: draft.donation_enabled,
    donation_title: draft.donation_title || null,
    donation_description: draft.donation_description || null,
    donation_pix_key: draft.donation_pix_key || null,
    donation_pix_name: draft.donation_pix_name || null,
    donation_qr_code: draft.donation_qr_code || null,
    access_key: draft.access_key || null,
    features: draft.features,
    how_it_works: draft.how_it_works,
    testimonials: draft.testimonials,
    faqs: draft.faqs,
    meta_title: draft.meta_title || null,
    meta_description: draft.meta_description || null,
    og_image: draft.og_image || null,
    section_order: draft.section_order,
  });

  // Auto-save function with debounce
  const autoSave = useCallback(async () => {
    if (!user || !data.id || saving || autoSaving || creatingDraft) return;
    
    setAutoSaving(true);
    try {
      const payload = buildPayload(data);
      const { error } = await supabase
        .from('landing_pages')
        .update(payload)
        .eq('id', data.id);
      
      if (!error) {
        setLastSaved(new Date());
        // Note: Preview updates via postMessage, no need to reload iframe
      }
    } catch (error) {
      console.error('Auto-save error:', error);
    } finally {
      setAutoSaving(false);
    }
  }, [user, data, saving, autoSaving, creatingDraft]);

  // Auto-save when data changes (with debounce)
  useEffect(() => {
    // Skip initial load
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }
    
    // Skip if not editing an existing page
    if (!data.id) return;
    
    // Clear previous timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    // Set new timeout for auto-save (1.5 seconds after last change)
    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, 1500);
    
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [data]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Listen for hover and click messages from preview iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const sectionMap: Record<string, string> = {
        'hero': 'basico',
        'pricing': 'precos',
        'features': 'conteudo',
        'about': 'sobre',
        'how-it-works': 'conteudo',
        'testimonials': 'depoimentos',
        'faq': 'faq',
        'cta': 'precos',
        'images': 'imagens',
        'donation': 'basico',
      };
      
      if (event.data?.type === 'section-hover') {
        const tab = sectionMap[event.data.section];
        if (tab) {
          setActiveTab(tab);
        }
      }
      
      if (event.data?.type === 'section-click') {
        const tab = sectionMap[event.data.section];
        if (tab) {
          setActiveTab(tab);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (isEditing && user) {
      fetchPage();
    }
  }, [id, user]);

  // Auto-cria um rascunho ao abrir /dashboard/new para o preview funcionar imediatamente
  useEffect(() => {
    const ensureDraft = async () => {
      if (authLoading) return;
      if (!user) return;
      if (isEditing) return;
      if (!showPreview) return;
      if (draftCreatedRef.current) return;

      draftCreatedRef.current = true;
      setCreatingDraft(true);

      try {
        // Gera um slug único para evitar colisões
        const base = slugify(data.title || 'nova-landing-page') || 'nova-landing-page';
        const suffix = String(Date.now()).slice(-5);
        const nextSlug = `${base}-${suffix}`;

        const draft: LandingPageData = { ...data, slug: nextSlug, is_published: false };
        setData(draft);

        const { data: created, error } = await supabase
          .from('landing_pages')
          .insert([buildPayload(draft)])
          .select('id')
          .single();

        if (error) throw error;
        if (created?.id) {
          setData((prev) => ({ ...prev, id: created.id }));
          navigate(`/dashboard/edit/${created.id}`, { replace: true });
        }
      } catch (error) {
        console.error('Error creating draft page:', error);
        // Se der erro, deixamos o usuário continuar manualmente (sem travar)
      } finally {
        setCreatingDraft(false);
      }
    };

    ensureDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, isEditing, showPreview]);

  const fetchPage = async () => {
    try {
      const { data: page, error } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setData({
        ...page,
        hero_title: page.hero_title || '',
        hero_subtitle: page.hero_subtitle || '',
        hero_cta_text: page.hero_cta_text || 'Comprar Agora',
        hero_cta_link: page.hero_cta_link || '',
        hero_image: page.hero_image || '',
        product_image: page.product_image || '',
        background_image: page.background_image || '',
        logo_image: page.logo_image || '',
        about_title: page.about_title || '',
        about_description: page.about_description || '',
        cta_title: page.cta_title || 'Pronto para começar?',
        cta_subtitle: page.cta_subtitle || 'Garanta seu acesso agora e transforme seus resultados',
        color_primary: page.color_primary || '#8B5CF6',
        color_accent: page.color_accent || '#10B981',
        color_background: page.color_background || '#0a0a0f',
        font_heading: page.font_heading || 'Inter',
        font_body: page.font_body || 'Inter',
        donation_enabled: page.donation_enabled ?? true,
        donation_title: page.donation_title || '💚 Apoie o Desenvolvedor',
        donation_description: page.donation_description || 'Gostou do sistema? Considere fazer uma doação via PIX para ajudar no desenvolvimento!',
        donation_pix_key: page.donation_pix_key || '48996029392',
        donation_pix_name: page.donation_pix_name || 'Marcondes Jorge Machado',
        donation_qr_code: page.donation_qr_code || '',
        access_key: page.access_key || '',
        features: (page.features as { title: string; description: string; icon?: string }[]) || [],
        how_it_works: (page.how_it_works as { step: number; title: string; description: string; image?: string }[]) || [],
        testimonials: (page.testimonials as { name: string; text: string; rating: number; avatar?: string }[]) || [],
        faqs: (page.faqs as { question: string; answer: string }[]) || [],
        price_original: page.price_original ? Number(page.price_original) : null,
        price_current: page.price_current ? Number(page.price_current) : null,
        meta_title: page.meta_title || '',
        meta_description: page.meta_description || '',
        og_image: page.og_image || '',
        section_order: (page.section_order as SectionId[]) || defaultSectionOrder,
      });
    } catch (error) {
      console.error('Error fetching page:', error);
      toast.error('Erro ao carregar página');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    const slug = data.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setData({ ...data, slug });
  };

  const handleSave = async () => {
    if (!data.slug) {
      toast.error('URL amigável é obrigatória');
      return;
    }
    if (!data.title) {
      toast.error('Título é obrigatório');
      return;
    }

    setSaving(true);
    try {
      const payload = buildPayload(data);

      if (isEditing) {
        const { error } = await supabase
          .from('landing_pages')
          .update(payload)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('landing_pages').insert([payload]);
        if (error) {
          if (error.message.includes('duplicate key')) {
            toast.error('Esta URL já está em uso');
            return;
          }
          throw error;
        }
      }

      toast.success(isEditing ? 'Página atualizada!' : 'Página criada!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('Erro ao salvar página');
    } finally {
      setSaving(false);
    }
  };

  const previewSrc = useMemo(() => {
    if (!data.slug) return null;
    const draftId = id || data.id;
    const qs = new URLSearchParams();
    qs.set('preview', 'true');
    if (draftId) qs.set('draftId', draftId);
    return `/p/${data.slug}?${qs.toString()}`;
  }, [data.slug, data.id, id]);

  const addFeature = () => {
    setData({
      ...data,
      features: [...data.features, { title: '', description: '', icon: '' }]
    });
  };

  const removeFeature = (index: number) => {
    setData({
      ...data,
      features: data.features.filter((_, i) => i !== index)
    });
  };

  const addStep = () => {
    setData({
      ...data,
      how_it_works: [...data.how_it_works, { step: data.how_it_works.length + 1, title: '', description: '', image: '' }]
    });
  };

  const removeStep = (index: number) => {
    setData({
      ...data,
      how_it_works: data.how_it_works.filter((_, i) => i !== index)
    });
  };

  const addTestimonial = () => {
    setData({
      ...data,
      testimonials: [...data.testimonials, { name: '', text: '', rating: 5, avatar: '' }]
    });
  };

  const removeTestimonial = (index: number) => {
    setData({
      ...data,
      testimonials: data.testimonials.filter((_, i) => i !== index)
    });
  };

  const addFaq = () => {
    setData({
      ...data,
      faqs: [...(data.faqs || []), { question: '', answer: '' }]
    });
  };

  const removeFaq = (index: number) => {
    setData({
      ...data,
      faqs: (data.faqs || []).filter((_, i) => i !== index)
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const previewUrl = `${window.location.origin}/p/${data.slug}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Tour for new users */}
      <EditorTour isNewPage={!isEditing} />
      
      {/* Header */}
      <header id="tour-header" className="border-b border-border/30 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold">{isEditing ? 'Editar' : 'Nova'} Landing Page</h1>
              <p className="text-xs text-muted-foreground">{data.slug ? `/p/${data.slug}` : 'Configure a URL'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Auto-save indicator */}
            {autoSaving && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Salvando...
              </span>
            )}
            {!autoSaving && lastSaved && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Check className="w-3 h-3 text-green-500" />
                Salvo
              </span>
            )}
            
            <Button 
              id="tour-preview-toggle"
              variant="outline" 
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPreview ? 'Ocultar' : 'Mostrar'} Preview
            </Button>
            <Button id="tour-save" onClick={handleSave} disabled={saving || autoSaving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Salvar
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      {showPreview ? (
        <ResizablePanelGroup direction="horizontal" className="flex-1" onLayout={handlePanelResize}>
          {/* Editor Panel */}
          <ResizablePanel defaultSize={defaultEditorSize} minSize={25} maxSize={75}>
            <div className="h-full overflow-auto">
          <main className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <div id="tour-tabs" className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 pb-2">
              <TabsList className="inline-flex flex-wrap gap-1 w-full h-auto p-1 bg-muted/50">
                  <TabsTrigger value="basico" className="text-xs whitespace-nowrap px-3 py-1.5">Básico</TabsTrigger>
                  <TabsTrigger value="layout" className="text-xs whitespace-nowrap px-3 py-1.5">Layout</TabsTrigger>
                  <TabsTrigger value="imagens" className="text-xs whitespace-nowrap px-3 py-1.5">Imagens</TabsTrigger>
                  <TabsTrigger value="precos" className="text-xs whitespace-nowrap px-3 py-1.5">Preços</TabsTrigger>
                  <TabsTrigger value="sobre" className="text-xs whitespace-nowrap px-3 py-1.5">Sobre</TabsTrigger>
                  <TabsTrigger value="doacao" className="text-xs whitespace-nowrap px-3 py-1.5">Doação</TabsTrigger>
                  <TabsTrigger value="conteudo" className="text-xs whitespace-nowrap px-3 py-1.5">Conteúdo</TabsTrigger>
                  <TabsTrigger value="depoimentos" className="text-xs whitespace-nowrap px-3 py-1.5">Depoimentos</TabsTrigger>
                  <TabsTrigger value="faq" className="text-xs whitespace-nowrap px-3 py-1.5">FAQ</TabsTrigger>
                  <TabsTrigger value="seo" className="text-xs whitespace-nowrap px-3 py-1.5">SEO</TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Básico */}
              <TabsContent value="basico">
                <Card className="bg-card/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Informações Básicas</CardTitle>
                    <CardDescription>Configure os dados principais</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div id="tour-slug" className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="slug" className="text-sm">URL Amigável</Label>
                        <Button variant="outline" size="sm" onClick={generateSlug} className="h-7 text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Gerar
                        </Button>
                      </div>
                      <Input
                        id="slug"
                        value={data.slug}
                        onChange={(e) => setData({ ...data, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                        placeholder="minha-pagina"
                        className="bg-background/50"
                      />
                      {data.slug && (
                        <div className="flex items-center gap-2 p-2 rounded-md bg-primary/10 border border-primary/20">
                          <span className="text-xs text-muted-foreground">Link:</span>
                          <code className="text-xs text-primary font-medium">seusite.com/{data.slug}</code>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-5 text-xs ml-auto"
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/p/${data.slug}`);
                              toast.success('Link copiado!');
                            }}
                          >
                            Copiar
                          </Button>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Use letras, números e hifens (ex: creditos-2024)
                      </p>
                    </div>

                    <div id="tour-title" className="space-y-2">
                      <Label htmlFor="title" className="text-sm">Título da Página</Label>
                      <Input
                        id="title"
                        value={data.title}
                        onChange={(e) => setData({ ...data, title: e.target.value })}
                        placeholder="Painel Créditos Lovable"
                        className="bg-background/50"
                      />
                    </div>

                    <div id="tour-publish" className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={data.is_published}
                          onCheckedChange={async (checked) => {
                            const newData = { ...data, is_published: checked };
                            setData(newData);
                            
                            // Salvar imediatamente quando o status de publicação mudar
                            if (data.id && user) {
                              try {
                                const { error } = await supabase
                                  .from('landing_pages')
                                  .update({ is_published: checked })
                                  .eq('id', data.id);
                                
                                if (error) {
                                  toast.error('Erro ao atualizar status');
                                } else {
                                  toast.success(checked ? 'Página publicada!' : 'Página despublicada');
                                  setLastSaved(new Date());
                                }
                              } catch (err) {
                                console.error('Error updating publish status:', err);
                              }
                            }
                          }}
                        />
                        <div>
                          <p className="font-medium text-sm">Publicada</p>
                          <p className="text-xs text-muted-foreground">
                            {data.is_published ? 'Visível' : 'Rascunho'}
                          </p>
                        </div>
                      </div>
                      {data.is_published && data.slug && (
                        <Button variant="outline" size="sm" onClick={() => window.open(`/p/${data.slug}`, '_blank')} className="h-7">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>

                    {/* Color Palette Selector */}
                    <div id="tour-colors" className="space-y-3 border-t border-border/30 pt-4">
                      <Label className="text-sm font-medium">Paleta de Cores</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {colorPalettes.map((palette) => (
                          <button
                            key={palette.name}
                            type="button"
                            onClick={() => setData({
                              ...data,
                              color_primary: palette.primary,
                              color_accent: palette.accent,
                              color_background: palette.background,
                            })}
                            className={`p-3 rounded-lg border transition-all text-left ${
                              data.color_primary === palette.primary && data.color_accent === palette.accent
                                ? 'border-primary ring-2 ring-primary/30'
                                : 'border-border/50 hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: palette.primary }}
                              />
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: palette.accent }}
                              />
                            </div>
                            <p className="text-xs font-medium">{palette.name}</p>
                          </button>
                        ))}
                      </div>
                      
                      {/* Custom Colors */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Primária</Label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={data.color_primary}
                              onChange={(e) => setData({ ...data, color_primary: e.target.value })}
                              className="w-10 h-10 rounded cursor-pointer border-0 shrink-0"
                            />
                            <Input
                              value={data.color_primary}
                              onChange={(e) => setData({ ...data, color_primary: e.target.value })}
                              className="h-10 text-xs bg-background/50"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Destaque</Label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={data.color_accent}
                              onChange={(e) => setData({ ...data, color_accent: e.target.value })}
                              className="w-10 h-10 rounded cursor-pointer border-0 shrink-0"
                            />
                            <Input
                              value={data.color_accent}
                              onChange={(e) => setData({ ...data, color_accent: e.target.value })}
                              className="h-10 text-xs bg-background/50"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Fundo</Label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={data.color_background}
                              onChange={(e) => setData({ ...data, color_background: e.target.value })}
                              className="w-10 h-10 rounded cursor-pointer border-0 shrink-0"
                            />
                            <Input
                              value={data.color_background}
                              onChange={(e) => setData({ ...data, color_background: e.target.value })}
                              className="h-10 text-xs bg-background/50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Typography Section */}
                    <div className="space-y-4 border-t border-border/30 pt-6">
                      <Label className="text-sm font-medium">Tipografia</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-3">
                          <Label className="text-xs text-muted-foreground">Fonte dos Títulos (H1, H2, H3)</Label>
                          <select
                            value={data.font_heading}
                            onChange={(e) => setData({ ...data, font_heading: e.target.value })}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-sm"
                          >
                            {fontOptions.map((font) => (
                              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                {font.name}
                              </option>
                            ))}
                          </select>
                          <p 
                            className="text-lg font-bold p-3 rounded bg-background/30 text-center"
                            style={{ fontFamily: data.font_heading }}
                          >
                            Prévia H1
                          </p>
                        </div>
                        <div className="space-y-3">
                          <Label className="text-xs text-muted-foreground">Fonte do Corpo</Label>
                          <select
                            value={data.font_body}
                            onChange={(e) => setData({ ...data, font_body: e.target.value })}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-sm"
                          >
                            {fontOptions.map((font) => (
                              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                {font.name}
                              </option>
                            ))}
                          </select>
                          <p 
                            className="text-sm p-3 rounded bg-background/30 text-center"
                            style={{ fontFamily: data.font_body }}
                          >
                            Prévia do texto
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hero_title" className="text-sm">Título do Hero</Label>
                      <Input
                        id="hero_title"
                        value={data.hero_title}
                        onChange={(e) => setData({ ...data, hero_title: e.target.value })}
                        placeholder="Créditos Lovable Ilimitados"
                        className="bg-background/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hero_subtitle" className="text-sm">Subtítulo</Label>
                      <Textarea
                        id="hero_subtitle"
                        value={data.hero_subtitle}
                        onChange={(e) => setData({ ...data, hero_subtitle: e.target.value })}
                        placeholder="Acesse o painel gerador..."
                        className="bg-background/50"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="hero_cta_text" className="text-sm">Texto CTA</Label>
                        <Input
                          id="hero_cta_text"
                          value={data.hero_cta_text}
                          onChange={(e) => setData({ ...data, hero_cta_text: e.target.value })}
                          placeholder="Comprar Agora"
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hero_cta_link" className="text-sm">Link CTA</Label>
                        <Input
                          id="hero_cta_link"
                          value={data.hero_cta_link}
                          onChange={(e) => setData({ ...data, hero_cta_link: e.target.value })}
                          placeholder="/checkout"
                          className="bg-background/50"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Imagens */}
              <TabsContent value="imagens">
                <Card className="bg-card/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Imagens</CardTitle>
                    <CardDescription>Upload ou cole URLs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ImageUpload
                      label="Logo"
                      value={data.logo_image}
                      onChange={(url) => setData({ ...data, logo_image: url })}
                      folder="logos"
                      aspectRatio="aspect-[3/1]"
                      placeholder="Logo da sua marca"
                    />
                    <ImageUpload
                      label="Imagem do Hero"
                      value={data.hero_image}
                      onChange={(url) => setData({ ...data, hero_image: url })}
                      folder="hero"
                      aspectRatio="aspect-video"
                    />
                    <div className="space-y-2">
                      <ImageUpload
                        label="Mockup do Produto / Dashboard (Laptop)"
                        value={data.product_image}
                        onChange={(url) => setData({ ...data, product_image: url })}
                        folder="products"
                        aspectRatio="aspect-video"
                        placeholder="Imagem do laptop/mockup exibido na seção principal"
                      />
                      <p className="text-xs text-muted-foreground">
                        Esta é a imagem do laptop com dashboard que aparece na seção Hero
                      </p>
                    </div>
                    <ImageUpload
                      label="Imagem de Fundo"
                      value={data.background_image}
                      onChange={(url) => setData({ ...data, background_image: url })}
                      folder="backgrounds"
                      aspectRatio="aspect-[21/9]"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Preços */}
              <TabsContent value="precos">
                <Card className="bg-card/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Preços</CardTitle>
                    <CardDescription>Configure valores</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-sm">Preço Original (De)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={data.price_original || ''}
                          onChange={(e) => setData({ ...data, price_original: e.target.value ? Number(e.target.value) : null })}
                          placeholder="297.00"
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Preço Atual (Por)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={data.price_current || ''}
                          onChange={(e) => setData({ ...data, price_current: e.target.value ? Number(e.target.value) : null })}
                          placeholder="97.00"
                          className="bg-background/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Parcelas</Label>
                      <Input
                        type="number"
                        min="1"
                        max="24"
                        value={data.price_installments}
                        onChange={(e) => setData({ ...data, price_installments: Number(e.target.value) })}
                        className="bg-background/50 max-w-24"
                      />
                    </div>

                    <div className="border-t border-border/30 pt-4 mt-4">
                      <h4 className="font-medium text-sm mb-3">Seção CTA Final</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-sm">Título do CTA</Label>
                          <Input
                            value={data.cta_title}
                            onChange={(e) => setData({ ...data, cta_title: e.target.value })}
                            placeholder="Pronto para começar?"
                            className="bg-background/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Subtítulo do CTA</Label>
                          <Input
                            value={data.cta_subtitle}
                            onChange={(e) => setData({ ...data, cta_subtitle: e.target.value })}
                            placeholder="Garanta seu acesso agora e transforme seus resultados"
                            className="bg-background/50"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Sobre */}
              <TabsContent value="sobre">
                <Card className="bg-card/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Sobre</CardTitle>
                    <CardDescription>Descreva seu produto</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Título</Label>
                      <Input
                        value={data.about_title}
                        onChange={(e) => setData({ ...data, about_title: e.target.value })}
                        placeholder="Por que escolher nosso painel?"
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Descrição</Label>
                      <Textarea
                        value={data.about_description}
                        onChange={(e) => setData({ ...data, about_description: e.target.value })}
                        placeholder="Descreva os benefícios..."
                        className="bg-background/50"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Doação */}
              <TabsContent value="doacao">
                <Card className="bg-card/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Seção de Doação</CardTitle>
                    <CardDescription>Configure a seção de apoio ao desenvolvedor</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={data.donation_enabled}
                          onCheckedChange={(checked) => setData({ ...data, donation_enabled: checked })}
                        />
                        <div>
                          <p className="font-medium text-sm">Exibir Seção</p>
                          <p className="text-xs text-muted-foreground">
                            {data.donation_enabled ? 'Visível na página' : 'Oculta'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Título</Label>
                      <Input
                        value={data.donation_title}
                        onChange={(e) => setData({ ...data, donation_title: e.target.value })}
                        placeholder="💚 Apoie o Desenvolvedor"
                        className="bg-background/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Descrição</Label>
                      <Textarea
                        value={data.donation_description}
                        onChange={(e) => setData({ ...data, donation_description: e.target.value })}
                        placeholder="Gostou do sistema? Considere fazer uma doação..."
                        className="bg-background/50"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-sm">Chave PIX</Label>
                        <Input
                          value={data.donation_pix_key}
                          onChange={(e) => setData({ ...data, donation_pix_key: e.target.value })}
                          placeholder="48996029392"
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Nome do Beneficiário</Label>
                        <Input
                          value={data.donation_pix_name}
                          onChange={(e) => setData({ ...data, donation_pix_name: e.target.value })}
                          placeholder="Marcondes Jorge Machado"
                          className="bg-background/50"
                        />
                      </div>
                    </div>

                    <ImageUpload
                      label="QR Code PIX"
                      value={data.donation_qr_code}
                      onChange={(url) => setData({ ...data, donation_qr_code: url })}
                      folder="qrcodes"
                      aspectRatio="aspect-square"
                      placeholder="Imagem do QR Code PIX"
                    />

                    <div className="border-t border-border/30 pt-4 mt-4">
                      <h4 className="font-medium text-sm mb-3">Chave de Acesso</h4>
                      <div className="space-y-2">
                        <Label className="text-sm">Chave de Acesso ao Sistema</Label>
                        <Input
                          value={data.access_key}
                          onChange={(e) => setData({ ...data, access_key: e.target.value })}
                          placeholder="Chave de acesso para os clientes"
                          className="bg-background/50"
                        />
                        <p className="text-xs text-muted-foreground">
                          Esta chave será exibida na página para os clientes acessarem o sistema
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Conteúdo */}
              <TabsContent value="conteudo">
                <div className="space-y-4">
                  <Card className="bg-card/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Recursos</CardTitle>
                        <Button variant="outline" size="sm" onClick={addFeature} className="h-7">
                          <Plus className="w-3 h-3 mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {(data.features || []).length === 0 ? (
                        <p className="text-muted-foreground text-center py-4 text-sm">Nenhum recurso</p>
                      ) : (
                        data.features.map((feature, index) => (
                          <div key={index} className="p-3 bg-background/50 rounded-lg space-y-2">
                            <div className="flex gap-2 items-start">
                              <div className="flex-1 grid grid-cols-2 gap-2">
                                <Input
                                  value={feature.title}
                                  onChange={(e) => {
                                    const updated = [...data.features];
                                    updated[index].title = e.target.value;
                                    setData({ ...data, features: updated });
                                  }}
                                  placeholder="Título"
                                  className="bg-card text-sm"
                                />
                                <Input
                                  value={feature.description}
                                  onChange={(e) => {
                                    const updated = [...data.features];
                                    updated[index].description = e.target.value;
                                    setData({ ...data, features: updated });
                                  }}
                                  placeholder="Descrição"
                                  className="bg-card text-sm"
                                />
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => removeFeature(index)} className="h-8 w-8">
                                <Trash2 className="w-3 h-3 text-destructive" />
                              </Button>
                            </div>
                            <Input
                              value={feature.icon || ''}
                              onChange={(e) => {
                                const updated = [...data.features];
                                updated[index].icon = e.target.value;
                                setData({ ...data, features: updated });
                              }}
                              placeholder="Ícone (ex: Zap, Shield)"
                              className="bg-card text-sm"
                            />
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Como Funciona</CardTitle>
                        <Button variant="outline" size="sm" onClick={addStep} className="h-7">
                          <Plus className="w-3 h-3 mr-1" />
                          Passo
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {(data.how_it_works || []).length === 0 ? (
                        <p className="text-muted-foreground text-center py-4 text-sm">Nenhum passo</p>
                      ) : (
                        data.how_it_works.map((step, index) => (
                          <div key={index} className="p-3 bg-background/50 rounded-lg space-y-2">
                            <div className="flex gap-2 items-start">
                              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1 grid grid-cols-2 gap-2">
                                <Input
                                  value={step.title}
                                  onChange={(e) => {
                                    const updated = [...data.how_it_works];
                                    updated[index].title = e.target.value;
                                    setData({ ...data, how_it_works: updated });
                                  }}
                                  placeholder="Título"
                                  className="bg-card text-sm"
                                />
                                <Input
                                  value={step.description}
                                  onChange={(e) => {
                                    const updated = [...data.how_it_works];
                                    updated[index].description = e.target.value;
                                    setData({ ...data, how_it_works: updated });
                                  }}
                                  placeholder="Descrição"
                                  className="bg-card text-sm"
                                />
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => removeStep(index)} className="h-8 w-8">
                                <Trash2 className="w-3 h-3 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Tab Depoimentos */}
              <TabsContent value="depoimentos">
                <Card className="bg-card/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Depoimentos</CardTitle>
                      <Button variant="outline" size="sm" onClick={addTestimonial} className="h-7">
                        <Plus className="w-3 h-3 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(data.testimonials || []).length === 0 ? (
                      <p className="text-muted-foreground text-center py-4 text-sm">Nenhum depoimento</p>
                    ) : (
                      data.testimonials.map((testimonial, index) => (
                        <div key={index} className="p-3 bg-background/50 rounded-lg space-y-2">
                          <div className="flex gap-2 items-center">
                            <Input
                              value={testimonial.name}
                              onChange={(e) => {
                                const updated = [...data.testimonials];
                                updated[index].name = e.target.value;
                                setData({ ...data, testimonials: updated });
                              }}
                              placeholder="Nome"
                              className="bg-card flex-1 text-sm"
                            />
                            <Input
                              type="number"
                              min="1"
                              max="5"
                              value={testimonial.rating}
                              onChange={(e) => {
                                const updated = [...data.testimonials];
                                updated[index].rating = Number(e.target.value);
                                setData({ ...data, testimonials: updated });
                              }}
                              className="bg-card w-16 text-sm"
                            />
                            <Button variant="ghost" size="icon" onClick={() => removeTestimonial(index)} className="h-8 w-8">
                              <Trash2 className="w-3 h-3 text-destructive" />
                            </Button>
                          </div>
                          <Textarea
                            value={testimonial.text}
                            onChange={(e) => {
                              const updated = [...data.testimonials];
                              updated[index].text = e.target.value;
                              setData({ ...data, testimonials: updated });
                            }}
                            placeholder="Texto..."
                            className="bg-card text-sm"
                            rows={2}
                          />
                          <Input
                            value={testimonial.avatar || ''}
                            onChange={(e) => {
                              const updated = [...data.testimonials];
                              updated[index].avatar = e.target.value;
                              setData({ ...data, testimonials: updated });
                            }}
                            placeholder="URL do avatar"
                            className="bg-card text-sm"
                          />
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab FAQ */}
              <TabsContent value="faq">
                <Card className="bg-card/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Perguntas Frequentes</CardTitle>
                      <Button variant="outline" size="sm" onClick={addFaq} className="h-7">
                        <Plus className="w-3 h-3 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(data.faqs || []).length === 0 ? (
                      <div className="text-center py-4 space-y-3">
                        <p className="text-muted-foreground text-sm">Nenhuma pergunta</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setData({ ...data, faqs: defaultData.faqs })}
                          className="h-8"
                        >
                          <Sparkles className="w-3 h-3 mr-2" />
                          Preencher com FAQs padrão
                        </Button>
                      </div>
                    ) : (
                      (data.faqs || []).map((faq, index) => (
                        <div key={index} className="p-3 bg-background/50 rounded-lg space-y-2">
                          <div className="flex gap-2 items-start">
                            <div className="flex-1 space-y-2">
                              <Input
                                value={faq.question}
                                onChange={(e) => {
                                  const updated = [...(data.faqs || [])];
                                  updated[index].question = e.target.value;
                                  setData({ ...data, faqs: updated });
                                }}
                                placeholder="Pergunta"
                                className="bg-card text-sm"
                              />
                              <Textarea
                                value={faq.answer}
                                onChange={(e) => {
                                  const updated = [...(data.faqs || [])];
                                  updated[index].answer = e.target.value;
                                  setData({ ...data, faqs: updated });
                                }}
                                placeholder="Resposta..."
                                className="bg-card text-sm"
                                rows={3}
                              />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeFaq(index)} className="h-8 w-8 mt-1">
                              <Trash2 className="w-3 h-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab SEO */}
              <TabsContent value="seo">
                <Card className="bg-card/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">SEO</CardTitle>
                    <CardDescription>Meta tags</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Meta Título</Label>
                      <Input
                        value={data.meta_title}
                        onChange={(e) => setData({ ...data, meta_title: e.target.value })}
                        placeholder="Título SEO (max 60)"
                        maxLength={60}
                        className="bg-background/50"
                      />
                      <p className="text-xs text-muted-foreground">{(data.meta_title || '').length}/60</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Meta Descrição</Label>
                      <Textarea
                        value={data.meta_description}
                        onChange={(e) => setData({ ...data, meta_description: e.target.value })}
                        placeholder="Descrição SEO (max 160)"
                        maxLength={160}
                        className="bg-background/50"
                        rows={2}
                      />
                      <p className="text-xs text-muted-foreground">{(data.meta_description || '').length}/160</p>
                    </div>
                    <ImageUpload
                      label="Imagem OG"
                      value={data.og_image}
                      onChange={(url) => setData({ ...data, og_image: url })}
                      folder="og"
                      aspectRatio="aspect-[1200/630]"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Layout */}
              <TabsContent value="layout">
                <SectionOrderManager
                  sectionOrder={data.section_order}
                  onOrderChange={(newOrder) => setData({ ...data, section_order: newOrder })}
                />
              </TabsContent>
            </Tabs>
          </main>
            </div>
          </ResizablePanel>

          {/* Resizable Handle */}
          <ResizableHandle withHandle className="bg-border/30 hover:bg-primary/50 transition-colors">
            <GripVertical className="w-3 h-3 text-muted-foreground" />
          </ResizableHandle>

          {/* Preview Panel */}
          <ResizablePanel defaultSize={defaultPreviewSize} minSize={25} maxSize={75}>
            <div className="h-full border-l border-border/30 bg-muted/20 flex flex-col">
              <div className="p-3 border-b border-border/30 bg-card/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Preview</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={refreshPreview}
                    className="h-7 text-xs"
                    title="Atualizar preview"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                  {data.slug && (
                    <Button variant="ghost" size="sm" onClick={() => window.open(`/p/${data.slug}`, '_blank')} className="h-7 text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Abrir
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                {creatingDraft ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
                      <p>Preparando preview...</p>
                    </div>
                  </div>
                ) : previewSrc ? (
                  <iframe
                    key={previewKey}
                    ref={iframeRef}
                    src={previewSrc}
                    className="w-full h-full border-0"
                    title="Preview"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Eye className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>Configure a URL para ver o preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="flex-1 overflow-auto">
          <main className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <div id="tour-tabs" className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
                <TabsList className="inline-flex w-auto min-w-full sm:grid sm:grid-cols-9 gap-1">
                  <TabsTrigger value="basico" className="text-xs whitespace-nowrap px-3 sm:px-2">Básico</TabsTrigger>
                  <TabsTrigger value="layout" className="text-xs whitespace-nowrap px-3 sm:px-2">Layout</TabsTrigger>
                  <TabsTrigger value="imagens" className="text-xs whitespace-nowrap px-3 sm:px-2">Imagens</TabsTrigger>
                  <TabsTrigger value="precos" className="text-xs whitespace-nowrap px-3 sm:px-2">Preços</TabsTrigger>
                  <TabsTrigger value="sobre" className="text-xs whitespace-nowrap px-3 sm:px-2">Sobre</TabsTrigger>
                  <TabsTrigger value="doacao" className="text-xs whitespace-nowrap px-3 sm:px-2">Doação</TabsTrigger>
                  <TabsTrigger value="conteudo" className="text-xs whitespace-nowrap px-3 sm:px-2">Conteúdo</TabsTrigger>
                  <TabsTrigger value="depoimentos" className="text-xs whitespace-nowrap px-3 sm:px-2">Depoimentos</TabsTrigger>
                  <TabsTrigger value="seo" className="text-xs whitespace-nowrap px-3 sm:px-2">SEO</TabsTrigger>
                </TabsList>
              </div>
              {/* Duplicated tabs content would go here if needed - for now we just show a message */}
              <p className="text-muted-foreground text-center py-8">Clique em "Mostrar Preview" para editar com visualização</p>
            </Tabs>
          </main>
        </div>
      )}
    </div>
  );
};

export default LandingPageEditor;
