import { supabase } from '@/integrations/supabase/client';

let cachedIp: string | null = null;

export const getUserIp = async (): Promise<string> => {
  if (cachedIp) return cachedIp;
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    cachedIp = data.ip;
    return data.ip;
  } catch {
    return 'unknown';
  }
};

export const isIpWhitelisted = async (): Promise<boolean> => {
  try {
    const ip = await getUserIp();
    const { data, error } = await supabase
      .from('whitelisted_ips' as any)
      .select('id')
      .eq('ip_address', ip)
      .eq('is_active', true)
      .limit(1);
    
    if (error) {
      console.error('Error checking IP whitelist:', error);
      return false;
    }
    
    return (data as any[])?.length > 0;
  } catch {
    return false;
  }
};
