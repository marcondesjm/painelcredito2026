import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  ArrowLeft,
  Loader2,
  Shield,
  Calendar,
  Mail,
  Eye,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import logoPainel from '@/assets/logo-dashboard.png';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  created_at: string;
  email?: string;
  role?: string;
  landing_pages_count?: number;
}

interface LandingPageAdmin {
  id: string;
  slug: string;
  title: string;
  is_published: boolean;
  created_at: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
}

const AdminDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [pages, setPages] = useState<LandingPageAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPages: 0,
    publishedPages: 0,
    newUsersToday: 0
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      checkAdminRole();
    }
  }, [user]);

  const checkAdminRole = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (data?.role === 'admin') {
        setIsAdmin(true);
        await fetchData();
      } else {
        toast.error('Acesso negado: você não é administrador');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
      toast.error('Erro ao verificar permissões');
      navigate('/dashboard');
    } finally {
      setCheckingAdmin(false);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Fetch all landing pages
      const { data: landingPages, error: pagesError } = await supabase
        .from('landing_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (pagesError) throw pagesError;

      // Count pages per user
      const pagesPerUser: Record<string, number> = {};
      landingPages?.forEach(page => {
        pagesPerUser[page.user_id] = (pagesPerUser[page.user_id] || 0) + 1;
      });

      // Map roles to users
      const roleMap: Record<string, string> = {};
      roles?.forEach(r => {
        roleMap[r.user_id] = r.role;
      });

      // Enrich user data
      const enrichedUsers = profiles?.map(profile => ({
        ...profile,
        role: roleMap[profile.user_id] || 'user',
        landing_pages_count: pagesPerUser[profile.user_id] || 0
      })) || [];

      // Map user names to landing pages
      const userMap: Record<string, { name: string }> = {};
      profiles?.forEach(p => {
        userMap[p.user_id] = { name: p.full_name || 'Sem nome' };
      });

      const enrichedPages = landingPages?.map(page => ({
        ...page,
        user_name: userMap[page.user_id]?.name || 'Desconhecido'
      })) || [];

      setUsers(enrichedUsers);
      setPages(enrichedPages);

      // Calculate stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const newUsersToday = profiles?.filter(p => {
        const createdAt = new Date(p.created_at);
        return createdAt >= today;
      }).length || 0;

      setStats({
        totalUsers: profiles?.length || 0,
        totalPages: landingPages?.length || 0,
        publishedPages: landingPages?.filter(p => p.is_published).length || 0,
        newUsersToday
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;

    toast.error('Exclusão de usuários requer acesso direto ao banco de dados por segurança.');
    setDeleteUserId(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading || checkingAdmin || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <img src={logoPainel} alt="Logo" className="h-14 object-contain" />
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-lg">Painel Admin</h1>
                <Badge variant="destructive" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Gerenciamento de usuários e páginas</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Total de Usuários</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.newUsersToday}</p>
                  <p className="text-sm text-muted-foreground">Novos Hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-500/10">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalPages}</p>
                  <p className="text-sm text-muted-foreground">Landing Pages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-500/10">
                  <Eye className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.publishedPages}</p>
                  <p className="text-sm text-muted-foreground">Publicadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Usuários ({stats.totalUsers})
            </TabsTrigger>
            <TabsTrigger value="pages" className="gap-2">
              <FileText className="w-4 h-4" />
              Landing Pages ({stats.totalPages})
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle>Usuários Cadastrados</CardTitle>
                <CardDescription>Lista de todos os usuários da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Landing Pages</TableHead>
                        <TableHead>Data de Cadastro</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            Nenhum usuário encontrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((profile) => (
                          <TableRow key={profile.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary">
                                    {(profile.full_name || 'U').charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium">{profile.full_name || 'Sem nome'}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={profile.role === 'admin' ? 'destructive' : 'secondary'}>
                                {profile.role === 'admin' ? (
                                  <><Shield className="w-3 h-3 mr-1" /> Admin</>
                                ) : (
                                  'Usuário'
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {profile.landing_pages_count} páginas
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                {formatDate(profile.created_at)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setDeleteUserId(profile.user_id)}
                                className="text-destructive hover:text-destructive"
                                disabled={profile.role === 'admin'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pages Tab */}
          <TabsContent value="pages">
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle>Todas as Landing Pages</CardTitle>
                <CardDescription>Visualize todas as páginas criadas na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Criador</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Criada em</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pages.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            Nenhuma página encontrada
                          </TableCell>
                        </TableRow>
                      ) : (
                        pages.map((page) => (
                          <TableRow key={page.id}>
                            <TableCell className="font-medium">{page.title}</TableCell>
                            <TableCell>
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                /p/{page.slug}
                              </code>
                            </TableCell>
                            <TableCell>{page.user_name}</TableCell>
                            <TableCell>
                              {page.is_published ? (
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Publicada
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Rascunho
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(page.created_at)}
                              </div>
                            </TableCell>
                            <TableCell>
                              {page.is_published && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => window.open(`/p/${page.slug}`, '_blank')}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O usuário e todas as suas landing pages serão permanentemente excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
