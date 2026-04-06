import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Wifi, Plus, Trash2, Loader2, Shield } from 'lucide-react';

interface WhitelistedIp {
  id: string;
  ip_address: string;
  label: string | null;
  is_active: boolean;
  created_at: string;
}

export const IpWhitelistTab = () => {
  const [ips, setIps] = useState<WhitelistedIp[]>([]);
  const [loading, setLoading] = useState(true);
  const [newIp, setNewIp] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchIps = async () => {
    const { data, error } = await supabase
      .from('whitelisted_ips' as any)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setIps(data as any as WhitelistedIp[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIps();
  }, []);

  const handleAdd = async () => {
    if (!newIp.trim()) {
      toast.error('Informe o IP');
      return;
    }
    setAdding(true);
    const { error } = await supabase
      .from('whitelisted_ips' as any)
      .insert({ ip_address: newIp.trim(), label: newLabel.trim() || null } as any);
    
    if (error) {
      if (error.message?.includes('duplicate')) {
        toast.error('Este IP já está cadastrado');
      } else {
        toast.error('Erro ao adicionar IP');
      }
    } else {
      toast.success('IP adicionado com sucesso!');
      setNewIp('');
      setNewLabel('');
      fetchIps();
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('whitelisted_ips' as any)
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Erro ao remover IP');
    } else {
      toast.success('IP removido!');
      setIps(prev => prev.filter(ip => ip.id !== id));
    }
  };

  const handleToggle = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('whitelisted_ips' as any)
      .update({ is_active: !currentState } as any)
      .eq('id', id);
    
    if (error) {
      toast.error('Erro ao atualizar');
    } else {
      setIps(prev => prev.map(ip => ip.id === id ? { ...ip, is_active: !currentState } : ip));
      toast.success(!currentState ? 'IP ativado' : 'IP desativado');
    }
  };

  if (loading) {
    return (
      <Card className="bg-card/50">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          IPs Autorizados
        </CardTitle>
        <CardDescription>
          Apenas IPs cadastrados aqui podem fazer login na plataforma. Seu IP admin já está incluído.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new IP */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Label className="text-xs mb-1">Endereço IP</Label>
            <Input
              placeholder="Ex: 201.131.136.94"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Label className="text-xs mb-1">Descrição (opcional)</Label>
            <Input
              placeholder="Ex: Casa do João"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAdd} disabled={adding} className="gap-2">
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Adicionar
            </Button>
          </div>
        </div>

        {/* IP list */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IP</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ips.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nenhum IP cadastrado
                </TableCell>
              </TableRow>
            ) : (
              ips.map((ip) => (
                <TableRow key={ip.id}>
                  <TableCell className="font-mono text-sm">{ip.ip_address}</TableCell>
                  <TableCell>{ip.label || '—'}</TableCell>
                  <TableCell>
                    <Badge
                      className="cursor-pointer"
                      variant={ip.is_active ? 'default' : 'secondary'}
                      onClick={() => handleToggle(ip.id, ip.is_active)}
                    >
                      {ip.is_active ? '✅ Ativo' : '⛔ Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(ip.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(ip.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
