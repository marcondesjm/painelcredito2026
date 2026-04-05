import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const PanelAccess = () => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/', { replace: true });
        return;
      }

      // Check if user has an approved order
      const { data: orders } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('status', 'approved')
        .limit(1);

      // Also check if user is admin
      const { data: isAdmin } = await supabase
        .rpc('has_role', { _user_id: session.user.id, _role: 'admin' as const });

      if ((orders && orders.length > 0) || isAdmin) {
        setAuthorized(true);
      } else {
        navigate('/', { replace: true });
      }
      setLoading(false);
    };

    checkAccess();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="fixed inset-0 bg-background">
      <iframe
        src="https://www.painelcreditoslovable.com/"
        className="w-full h-full border-0"
        title="Painel"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export default PanelAccess;
