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

interface HomepageSettings {
  pricing_tiers: PricingTier[];
  hero: HeroSettings;
  pix_key: string;
  pix_name: string;
  whatsapp_number: string;
}

const defaultSettings: HomepageSettings = {
  pricing_tiers: [],
  hero: {
    title: 'Créditos Infinitos na Lovable.',
    title_highlight: 'Simples. Rápido. Automático.',
    subtitle: 'Use nosso painel exclusivo e gere créditos ilimitados para seus projetos Lovable e revenda créditos.',
    price_original: 600,
    price_current: 349.99,
    cta_text: 'Comprar Agora',
    badge_text: 'Oferta Limitada'
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
        } else if (item.key === 'pix_key' && typeof item.value === 'string') {
          newSettings.pix_key = item.value;
        } else if (item.key === 'pix_name' && typeof item.value === 'string') {
          newSettings.pix_name = item.value;
        } else if (item.key === 'whatsapp_number' && typeof item.value === 'string') {
          newSettings.whatsapp_number = item.value;
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

export type { HeroSettings, HomepageSettings };
