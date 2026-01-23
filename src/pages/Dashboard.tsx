import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  ExternalLink, 
  Edit, 
  Trash2, 
  LogOut, 
  Loader2,
  LayoutDashboard,
  Shield,
  Heart,
  Copy,
  Check,
  HelpCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import logoPainel from '@/assets/logo-dashboard.png';
import { DashboardTour, triggerDashboardTour } from '@/components/DashboardTour';

interface LandingPage {
  id: string;
  slug: string;
  title: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  const pixKey = '48996029392';
  const pixName = 'Marcondes Jorge Machado';

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    toast.success('Chave PIX copiada!');
    setTimeout(() => setCopiedPix(false), 2000);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPages();
      checkAdminRole();
    }
  }, [user]);

  const checkAdminRole = async () => {
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .single();

      setIsAdmin(data?.role === 'admin');
    } catch (error) {
      console.error('Error checking admin role:', error);
    }
  };

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('id, slug, title, is_published, created_at, updated_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast.error('Erro ao carregar páginas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('landing_pages')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;
      
      setPages(pages.filter(p => p.id !== deleteId));
      toast.success('Página excluída com sucesso');
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Erro ao excluir página');
    } finally {
      setDeleteId(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Tour */}
      <DashboardTour />
      
      {/* Header */}
      <header className="border-b border-border/30 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-6 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-6">
            <img src={logoPainel} alt="Logo" className="h-12 sm:h-24 md:h-32 lg:h-48 w-auto object-contain" />
            <div className="hidden md:block">
              <h1 className="font-bold text-xl lg:text-2xl">Dashboard</h1>
              <p className="text-muted-foreground text-sm">Gerencie suas landing pages</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
            <Button 
              id="tour-dashboard-donate"
              variant="outline" 
              size="sm" 
              onClick={() => setShowDonationModal(true)}
              className="border-green-500/50 text-green-500 hover:bg-green-500/10 text-xs sm:text-sm px-2 sm:px-3"
            >
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Doar</span>
            </Button>
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/admin')} className="border-destructive/50 text-destructive hover:bg-destructive/10 text-xs sm:text-sm px-2 sm:px-3">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Painel Admin</span>
              </Button>
            )}
            <Button 
              id="tour-dashboard-site"
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')} 
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              <LayoutDashboard className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Ver Site</span>
            </Button>
            {/* Help button to restart tour */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => user && triggerDashboardTour(user.id)}
              title="Ver tutorial"
              className="h-8 w-8"
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs sm:text-sm px-2 sm:px-3">
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Suas Landing Pages</h2>
            <p className="text-muted-foreground">Crie e gerencie suas páginas de vendas</p>
          </div>
          <Button id="tour-dashboard-new-btn" onClick={() => navigate('/dashboard/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Página
          </Button>
        </div>

        <div id="tour-dashboard-pages">
          {pages.length === 0 ? (
            <Card className="bg-card/50 border-dashed">
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Nenhuma página criada</h3>
                <p className="text-muted-foreground mb-4">
                  Crie sua primeira landing page para começar a vender
                </p>
                <Button onClick={() => navigate('/dashboard/new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Landing Page
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <Card key={page.id} className="bg-card/50 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{page.title}</CardTitle>
                        <CardDescription className="truncate">/{page.slug}</CardDescription>
                      </div>
                      <Badge variant={page.is_published ? "default" : "secondary"}>
                        {page.is_published ? 'Publicada' : 'Rascunho'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/dashboard/edit/${page.id}`)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      {page.is_published && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(`/p/${page.slug}`, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setDeleteId(page.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir página?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A página será permanentemente excluída.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Donation Modal */}
      <Dialog open={showDonationModal} onOpenChange={setShowDonationModal}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-lg sm:text-xl flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              Apoie o Desenvolvedor
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-4 sm:gap-6 py-2 sm:py-4">
            {/* QR Code */}
            <div className="bg-white p-2 sm:p-4 rounded-xl shadow-lg">
              <img 
                src="https://nubank.com.br/cobrar/6d6f1/6790d4a9-0f3e-4d0e-a217-4bb1f43a457e" 
                alt="QR Code PIX"
                className="w-32 h-32 sm:w-48 sm:h-48 object-contain"
                onError={(e) => {
                  e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${pixKey}`;
                }}
              />
            </div>

            {/* PIX Info */}
            <div className="w-full space-y-2 sm:space-y-3">
              <div className="bg-muted/50 rounded-lg p-3 sm:p-4 space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground">Nome do beneficiário:</p>
                <p className="font-semibold text-sm sm:text-base">{pixName}</p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3 sm:p-4 space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground">Chave PIX (Telefone):</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono font-semibold text-sm sm:text-base">{pixKey}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyPix}
                    className="shrink-0"
                  >
                    {copiedPix ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground text-center px-2">
              Sua doação ajuda a manter o projeto e desenvolver novas funcionalidades! 💚
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
