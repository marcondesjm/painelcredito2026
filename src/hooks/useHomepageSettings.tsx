import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PricingTier } from '@/components/PricingTiersSection';

interface HeroSettings {
  title: string;
  title_highlight: string;
  subtitle: string;
  price_original: number;
  price_current: number;
  cta_text: string;
  badge_text: string;
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

interface HomepageSettings {
  pricing_tiers: PricingTier[];
  custom_package_options: CustomPackageOption[];
  hero: HeroSettings;
  checkout: CheckoutSettings;
  social_proof: SocialProofSettings;
  guarantee: GuaranteeSettings;
  pix_key: string;
  pix_name: string;
  whatsapp_number: string;
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
    badge_text: 'Oferta Limitada'
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
  whatsapp_number: '5548996029392'
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

export type { HeroSettings, CheckoutSettings, SocialProofSettings, SocialProofCustomer, HomepageSettings, CustomPackageOption, GuaranteeSettings };
