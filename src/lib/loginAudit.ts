import { supabase } from '@/integrations/supabase/client';

export const logLoginAttempt = async (params: {
  email: string;
  user_id?: string;
  status: 'success' | 'failed';
  failure_reason?: string;
}) => {
  try {
    await supabase.functions.invoke('log-login-attempt', {
      body: {
        email: params.email,
        user_id: params.user_id || null,
        status: params.status,
        failure_reason: params.failure_reason || null,
        user_agent: navigator.userAgent,
        referer: window.location.href,
      },
    });
  } catch (e) {
    console.error('Failed to log login attempt:', e);
  }
};
