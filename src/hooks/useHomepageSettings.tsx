import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PricingTier } from '@/components/PricingTiersSection';

interface HeroPriceLine {
  price_original: number;
  price_current: number;
  label?: string;
}

interface HeroRenewalLine {
  text: string;
}

interface HeroSettings {
  title: string;
  title_highlight: string;
  subtitle: string;
  price_original: number;
  price_current: number;
  cta_text: string;
  badge_text: string;
  daily_renewal_text: string;
  extra_prices?: HeroPriceLine[];
  extra_renewals?: HeroRenewalLine[];
}

interface CheckoutSettings {
  product_subtitle: string;
  product_description: string;
  badge_text: string;
  benefits: string[];
  button_text: string;
}

interface SocialProofCustomer {
  name: string;
  city: string;
  state: string;
  product?: 'gerador' | 'creditos';
}

interface SocialProofSettings {
  enabled: boolean;
  product_name: string;
  customers: SocialProofCustomer[];
  credit_options: number[];
}

interface CustomPackageOption {
  credits: number;
  price: number;
  bonus_credits?: number;
}

interface GuaranteeSettings {
  title: string;
  items: string[];
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSettings {
  title: string;
  subtitle: string;
  items: FAQItem[];
}

interface SectionsVisibility {
  hero: boolean;
  pricing: boolean;
  features: boolean;
  why_choose: boolean;
  how_it_works: boolean;
  video: boolean;
  secure_purchase: boolean;
  testimonials: boolean;
  guarantee: boolean;
  stats: boolean;
  faq: boolean;
  final_cta: boolean;
}

interface TrackingSettings {
  google_tag_manager: string;
  facebook_pixel: string;
  google_analytics: string;
  tiktok_pixel: string;
}

interface HomepageSettings {
  pricing_tiers: PricingTier[];
  custom_package_options: CustomPackageOption[];
  hero: HeroSettings;
  checkout: CheckoutSettings;
  social_proof: SocialProofSettings;
  guarantee: GuaranteeSettings;
  faq: FAQSettings;
  pix_key: string;
  pix_name: string;
  whatsapp_number: string;
  sections_visibility: SectionsVisibility;
  tracking: TrackingSettings;
}

const defaultSettings: HomepageSettings = {
  guarantee: {
    title: 'Garantia',
    items: [
      "Garantimos a entrega e funcionamento do produto no momento da liberação.",
      "Caso ocorra reset de créditos e a plataforma ainda permita novas adições, realizamos a reposição por até 15 dias após a recarga.",
      "O prazo de 15 dias refere-se à garantia de entrega e funcionamento inicial.",
    ],
  },
  faq: {
    title: 'Como funciona a recarga de créditos?',
    subtitle: 'Tudo você precisa para usar a Lovable sem preocupações.',
    items: [
      { question: "Como funciona para gerar os créditos?", answer: "É bem simples! Você precisa copiar o link de convite da conta que deseja depositar os créditos e enviar esse link no nosso painel. Depois, selecione a quantidade de créditos desejada e seus créditos serão depositados automaticamente." },
      { question: "Como eu sei se funciona mesmo e não é golpe?", answer: "Você pode pedir para nós enviarmos créditos para você para que você veja os resultados e o funcionamento por conta própria." },
      { question: "Como funciona o acesso ao produto?", answer: "Após a confirmação do pagamento, será criado automaticamente um login utilizando o e-mail cadastrado na compra. Com esse login, você poderá acessar o painel diretamente pelo nosso site, na aba Painel. O acesso é liberado de forma automática e imediata." },
      { question: "Tem tutorial por vídeo e manual de acesso?", answer: "Sim! Temos tutorial em vídeo e manual de acesso completo." },
      { question: "Por quanto tempo terei acesso?", answer: "Você terá acesso vitalício ao painel, incluindo todas as atualizações futuras sem custo adicional." },
      { question: "Quais sistemas operacionais o programa funciona?", answer: "O painel funciona 100% online, direto no navegador. Acesse de qualquer dispositivo (Windows, Mac, Linux, Android, iOS)." },
      { question: "Tem limite de resgate de créditos?", answer: "Não há limite de resgates. Você pode gerar quantos créditos quiser, sem restrições." },
      { question: "Está funcionando depois da atualização do Lovable?", answer: "Sim, está funcionando depois do fix que a Lovable deu no método antigo das extensões que clicavam publish ao mesmo tempo. Nosso painel utiliza métodos diferentes e atualizados." },
      { question: "Funciona em uma conta que já indicou mais de 10 convites?", answer: "Sim! Você pode resgatar créditos em uma conta que já indicou mais de 10 pessoas, desde que você tenha acesso a uma conta que já resgatou créditos nessa conta, então você pode depositar na conta desejada." },
    ],
  },
  pricing_tiers: [],
  custom_package_options: [
    { credits: 100, price: 10 },
    { credits: 200, price: 18 },
    { credits: 500, price: 40 },
  ],
  hero: {
    title: 'Créditos Infinitos na Lovable.',
    title_highlight: 'Simples. Rápido. Automático.',
    subtitle: 'Use nosso painel exclusivo e gere créditos ilimitados para seus projetos Lovable e revenda créditos.',
    price_original: 600,
    price_current: 349.99,
    cta_text: 'Comprar Agora',
    badge_text: 'Oferta Limitada',
    daily_renewal_text: '🔄 Renovação diária de 5k créditos!'
  },
  checkout: {
    product_subtitle: 'Acesso Completo',
    product_description: 'Acesso vitalício • Sem mensalidades',
    badge_text: 'Oferta Limitada',
    benefits: [
      'Acesso Vitalício ao Painel',
      'Gerador de Créditos Ilimitado',
      'Suporte Premium 24/7',
      'Atualizações Gratuitas',
      'Comunidade Exclusiva'
    ],
    button_text: 'COMPRAR AGORA'
  },
  social_proof: {
    enabled: true,
    product_name: 'o Gerador',
    customers: [
      { name: "Carlos M.", city: "São Paulo", state: "SP" },
      { name: "Ana Paula S.", city: "Rio de Janeiro", state: "RJ" },
      { name: "Roberto F.", city: "Belo Horizonte", state: "MG" },
      { name: "Juliana C.", city: "Curitiba", state: "PR" },
      { name: "Fernando L.", city: "Salvador", state: "BA" },
      { name: "Mariana R.", city: "Brasília", state: "DF" },
      { name: "Pedro H.", city: "Porto Alegre", state: "RS" },
      { name: "Thiago N.", city: "Florianópolis", state: "SC" },
    ],
    credit_options: [200, 500, 1000, 2000]
  },
  pix_key: '',
  pix_name: '',
  whatsapp_number: '5548996029392',
  sections_visibility: {
    hero: true,
    pricing: true,
    features: true,
    why_choose: true,
    how_it_works: true,
    video: true,
    secure_purchase: true,
    testimonials: true,
    guarantee: true,
    stats: true,
    faq: true,
    final_cta: true,
  },
  tracking: {
    google_tag_manager: '',
    facebook_pixel: '',
    google_analytics: '',
    tiktok_pixel: '',
  },
};

export const useHomepageSettings = () => {
  const [settings, setSettings] = useState<HomepageSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('homepage_settings')
        .select('key, value');

      if (fetchError) throw fetchError;

      const newSettings: HomepageSettings = { ...defaultSettings };
      
      data?.forEach((item: { key: string; value: unknown }) => {
        if (item.key === 'pricing_tiers' && Array.isArray(item.value)) {
          newSettings.pricing_tiers = item.value as PricingTier[];
        } else if (item.key === 'hero' && item.value) {
          newSettings.hero = item.value as HeroSettings;
        } else if (item.key === 'custom_package_options' && Array.isArray(item.value)) {
          newSettings.custom_package_options = item.value as CustomPackageOption[];
        } else if (item.key === 'pix_key' && typeof item.value === 'string') {
          newSettings.pix_key = item.value;
        } else if (item.key === 'pix_name' && typeof item.value === 'string') {
          newSettings.pix_name = item.value;
        } else if (item.key === 'whatsapp_number' && typeof item.value === 'string') {
          newSettings.whatsapp_number = item.value;
        } else if (item.key === 'checkout' && item.value) {
          newSettings.checkout = item.value as CheckoutSettings;
        } else if (item.key === 'social_proof' && item.value) {
          newSettings.social_proof = item.value as SocialProofSettings;
        } else if (item.key === 'guarantee' && item.value) {
          newSettings.guarantee = item.value as GuaranteeSettings;
        } else if (item.key === 'faq' && item.value) {
          newSettings.faq = item.value as FAQSettings;
        } else if (item.key === 'sections_visibility' && item.value) {
          newSettings.sections_visibility = { ...defaultSettings.sections_visibility, ...(item.value as Partial<SectionsVisibility>) };
        } else if (item.key === 'tracking' && item.value) {
          newSettings.tracking = { ...defaultSettings.tracking, ...(item.value as Partial<TrackingSettings>) };
        }
      });

      setSettings(newSettings);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching homepage settings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSetting = async (key: string, value: unknown) => {
    try {
      // Check if setting exists
      const { data: existing } = await supabase
        .from('homepage_settings')
        .select('id')
        .eq('key', key)
        .maybeSingle();

      if (existing) {
        const { error: updateError } = await supabase
          .from('homepage_settings')
          .update({ value: value as any })
          .eq('key', key);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('homepage_settings')
          .insert({ key, value: value as any });
        if (insertError) throw insertError;
      }

      await fetchSettings();
      return { success: true };
    } catch (err: any) {
      console.error('Error updating homepage setting:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings,
    updateSetting
  };
};

export type { HeroSettings, HeroPriceLine, HeroRenewalLine, CheckoutSettings, SocialProofSettings, SocialProofCustomer, HomepageSettings, CustomPackageOption, GuaranteeSettings, FAQSettings, FAQItem, SectionsVisibility, TrackingSettings };
