import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Save, Loader2, Star, CreditCard, MessageSquare, ShoppingCart, Bell, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useHomepageSettings, HeroSettings, CheckoutSettings, SocialProofSettings, SocialProofCustomer, CustomPackageOption, GuaranteeSettings, FAQSettings, FAQItem, SectionsVisibility } from '@/hooks/useHomepageSettings';
import { PricingTier } from '@/components/PricingTiersSection';

export const HomepageEditor = () => {
  const { settings, loading, updateSetting, refetch } = useHomepageSettings();
  const [saving, setSaving] = useState(false);
  
  // Local state for editing
  const [hero, setHero] = useState<HeroSettings>(settings.hero);
  const [tiers, setTiers] = useState<PricingTier[]>(settings.pricing_tiers);
  const [pixKey, setPixKey] = useState(settings.pix_key);
  const [pixName, setPixName] = useState(settings.pix_name);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsapp_number);
  const [checkout, setCheckout] = useState<CheckoutSettings>(settings.checkout);
  const [socialProof, setSocialProof] = useState<SocialProofSettings>(settings.social_proof);
  const [customPackageOptions, setCustomPackageOptions] = useState<CustomPackageOption[]>(settings.custom_package_options);
  const [guarantee, setGuarantee] = useState<GuaranteeSettings>(settings.guarantee);
  const [faq, setFaq] = useState<FAQSettings>(settings.faq);
  const [sectionsVisibility, setSectionsVisibility] = useState<SectionsVisibility>(settings.sections_visibility);

  useEffect(() => {
    setHero(settings.hero);
    setTiers(settings.pricing_tiers);
    setPixKey(settings.pix_key);
    setPixName(settings.pix_name);
    setWhatsappNumber(settings.whatsapp_number);
    setCheckout(settings.checkout);
    setSocialProof(settings.social_proof);
    setCustomPackageOptions(settings.custom_package_options);
    setGuarantee(settings.guarantee);
    setFaq(settings.faq);
    setSectionsVisibility(settings.sections_visibility);
  }, [settings]);

  const handleSaveHero = async () => {
    setSaving(true);
    const result = await updateSetting('hero', hero);
    if (result.success) {
      toast.success('Hero atualizado com sucesso!');
    } else {
      toast.error('Erro ao salvar: ' + result.error);
    }
    setSaving(false);
  };

  const handleSaveTiers = async () => {
    setSaving(true);
    const result = await updateSetting('pricing_tiers', tiers);
    await updateSetting('custom_package_options', customPackageOptions);
    if (result.success) {
      toast.success('Pacotes atualizados com sucesso!');
    } else {
      toast.error('Erro ao salvar: ' + result.error);
    }
    setSaving(false);
  };

  const handleSavePayment = async () => {
    setSaving(true);
    await updateSetting('pix_key', pixKey);
    await updateSetting('pix_name', pixName);
    const result = await updateSetting('whatsapp_number', whatsappNumber);
    if (result.success) {
      toast.success('Configurações de pagamento salvas!');
    } else {
      toast.error('Erro ao salvar: ' + result.error);
    }
    setSaving(false);
  };

  const addTier = () => {
    const newTier: PricingTier = {
      id: `tier-${Date.now()}`,
      name: 'Novo Pacote',
      credits: 1000,
      price_original: 100,
      price_current: 49.99,
      available: 50,
      sales: 0,
      checkout_link: '/checkout',
      highlight: false
    };
    setTiers([...tiers, newTier]);
  };

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const updateTier = (index: number, field: keyof PricingTier, value: any) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setTiers(newTiers);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Página Principal</h2>
          <p className="text-muted-foreground">Edite o conteúdo da homepage</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open('/', '_blank')}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver Página
          </Button>
          <Button variant="outline" onClick={refetch}>
            Atualizar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="sections">Seções</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="tiers">Pacotes</TabsTrigger>
          <TabsTrigger value="checkout">Checkout</TabsTrigger>
          <TabsTrigger value="social">Prova Social</TabsTrigger>
          <TabsTrigger value="guarantee">Garantia</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="payment">Pagamento</TabsTrigger>
        </TabsList>

        {/* Sections Visibility Tab */}
        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Visibilidade das Seções
              </CardTitle>
              <CardDescription>Ative ou desative as seções exibidas na página principal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {([
                { key: 'hero' as const, label: 'Hero (Créditos Infinitos)' },
                { key: 'pricing' as const, label: 'Pacotes de Preços' },
                { key: 'features' as const, label: 'Funcionalidades' },
                { key: 'why_choose' as const, label: 'Por que Escolher' },
                { key: 'how_it_works' as const, label: 'Como Funciona' },
                { key: 'video' as const, label: 'Vídeo' },
                { key: 'secure_purchase' as const, label: 'Compra Segura' },
                { key: 'testimonials' as const, label: 'Depoimentos' },
                { key: 'guarantee' as const, label: 'Garantia' },
                { key: 'stats' as const, label: 'Estatísticas' },
                { key: 'faq' as const, label: 'FAQ' },
                { key: 'final_cta' as const, label: 'CTA Final' },
              ]).map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <Label className="text-sm font-medium">{label}</Label>
                  <Switch
                    checked={sectionsVisibility[key]}
                    onCheckedChange={(checked) =>
                      setSectionsVisibility({ ...sectionsVisibility, [key]: checked })
                    }
                  />
                </div>
              ))}

              <Button
                onClick={async () => {
                  setSaving(true);
                  const result = await updateSetting('sections_visibility', sectionsVisibility);
                  if (result.success) {
                    toast.success('Visibilidade das seções salva!');
                  } else {
                    toast.error('Erro ao salvar: ' + result.error);
                  }
                  setSaving(false);
                }}
                disabled={saving}
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Salvar Visibilidade
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero Tab */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seção Hero</CardTitle>
              <CardDescription>Configure o título, subtítulo e preços do topo da página</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Título Principal</Label>
                  <Input
                    value={hero.title}
                    onChange={(e) => setHero({ ...hero, title: e.target.value })}
                    placeholder="Créditos Infinitos na Lovable."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Título em Destaque (Gradiente)</Label>
                  <Input
                    value={hero.title_highlight}
                    onChange={(e) => setHero({ ...hero, title_highlight: e.target.value })}
                    placeholder="Simples. Rápido. Automático."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Textarea
                  value={hero.subtitle}
                  onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                  placeholder="Use nosso painel exclusivo..."
                  rows={2}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Preço Original (De)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={hero.price_original}
                    onChange={(e) => setHero({ ...hero, price_original: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preço Atual (Por)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={hero.price_current}
                    onChange={(e) => setHero({ ...hero, price_current: Number(e.target.value) })}
                  />
                </div>
                 <div className="space-y-2">
                  <Label>Texto do Botão</Label>
                  <Input
                    value={hero.cta_text}
                    onChange={(e) => setHero({ ...hero, cta_text: e.target.value })}
                    placeholder="Comprar Agora"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Texto do Badge (ex: Oferta Limitada)</Label>
                  <Input
                    value={hero.badge_text || ''}
                    onChange={(e) => setHero({ ...hero, badge_text: e.target.value })}
                    placeholder="Oferta Limitada"
                  />
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-muted-foreground line-through">{formatPrice(hero.price_original)}</span>
                  <span className="text-2xl font-bold text-accent">{formatPrice(hero.price_current)}</span>
                  {hero.price_original > hero.price_current && (
                    <span className="bg-accent/20 text-accent text-xs px-2 py-1 rounded">
                      Economia de {Math.round(((hero.price_original - hero.price_current) / hero.price_original) * 100)}%
                    </span>
                  )}
                </div>
              </div>

              <Button onClick={handleSaveHero} disabled={saving} className="w-full">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Salvar Hero
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tiers Tab */}
        <TabsContent value="tiers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Pacotes de Créditos</span>
                <Button onClick={addTier} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Pacote
                </Button>
              </CardTitle>
              <CardDescription>Configure os pacotes de créditos exibidos na página principal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tiers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum pacote configurado. Clique em "Adicionar Pacote" para começar.
                </div>
              ) : (
                <div className="space-y-4">
                  {tiers.map((tier, index) => (
                    <Card key={tier.id} className={tier.highlight ? 'ring-2 ring-primary' : ''}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                              <div className="space-y-2">
                                <Label>Nome do Pacote</Label>
                                <Input
                                  value={tier.name}
                                  onChange={(e) => updateTier(index, 'name', e.target.value)}
                                  placeholder="Pacote Básico"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Créditos</Label>
                                <Input
                                  type="number"
                                  value={tier.credits}
                                  onChange={(e) => updateTier(index, 'credits', Number(e.target.value))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Bônus de Créditos</Label>
                                <Input
                                  type="number"
                                  value={tier.bonus_credits || 0}
                                  onChange={(e) => updateTier(index, 'bonus_credits', Number(e.target.value))}
                                  placeholder="0"
                                />
                              </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-4">
                              <div className="space-y-2">
                                <Label>Preço Original (De)</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={tier.price_original}
                                  onChange={(e) => updateTier(index, 'price_original', Number(e.target.value))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Preço Atual (Por)</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={tier.price_current}
                                  onChange={(e) => updateTier(index, 'price_current', Number(e.target.value))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Disponíveis</Label>
                                <Input
                                  type="number"
                                  value={tier.available}
                                  onChange={(e) => updateTier(index, 'available', Number(e.target.value))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Vendas</Label>
                                <Input
                                  type="number"
                                  value={tier.sales}
                                  onChange={(e) => updateTier(index, 'sales', Number(e.target.value))}
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={tier.highlight}
                                  onCheckedChange={(checked) => updateTier(index, 'highlight', checked)}
                                />
                                <Label className="flex items-center gap-1">
                                  <Star className="w-4 h-4" />
                                  Destacar (Mais Popular)
                                </Label>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeTier(index)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remover
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Custom Package Options */}
              <Card className="border-dashed">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>Pacote Personalizado (Opções)</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setCustomPackageOptions([...customPackageOptions, { credits: 100, price: 10 }])}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Opção
                    </Button>
                  </CardTitle>
                  <CardDescription>Configure os valores de créditos e preços disponíveis no card personalizado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {customPackageOptions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhuma opção configurada. O card personalizado não será exibido.</p>
                  ) : (
                    <div className="space-y-2">
                      {customPackageOptions.map((opt, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="flex-1 space-y-1">
                            <Label className="text-xs">Créditos</Label>
                            <Input
                              type="number"
                              value={opt.credits}
                              onChange={(e) => {
                                const updated = [...customPackageOptions];
                                updated[index] = { ...updated[index], credits: Number(e.target.value) };
                                setCustomPackageOptions(updated);
                              }}
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <Label className="text-xs">Preço (R$)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={opt.price}
                              onChange={(e) => {
                                const updated = [...customPackageOptions];
                                updated[index] = { ...updated[index], price: Number(e.target.value) };
                                setCustomPackageOptions(updated);
                              }}
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <Label className="text-xs">Bônus</Label>
                            <Input
                              type="number"
                              value={opt.bonus_credits || 0}
                              onChange={(e) => {
                                const updated = [...customPackageOptions];
                                updated[index] = { ...updated[index], bonus_credits: Number(e.target.value) };
                                setCustomPackageOptions(updated);
                              }}
                              placeholder="0"
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="mt-5"
                            onClick={() => setCustomPackageOptions(customPackageOptions.filter((_, i) => i !== index))}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button onClick={handleSaveTiers} disabled={saving} className="w-full">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Salvar Pacotes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings Tab */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Configurações PIX
              </CardTitle>
              <CardDescription>Configure sua chave PIX para receber pagamentos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Chave PIX</Label>
                  <Input
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    placeholder="CPF, CNPJ, Email, Telefone ou Chave Aleatória"
                  />
                  <p className="text-xs text-muted-foreground">
                    Insira sua chave PIX para gerar o QR Code de pagamento
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Nome do Beneficiário</Label>
                  <Input
                    value={pixName}
                    onChange={(e) => setPixName(e.target.value)}
                    placeholder="Nome que aparecerá no PIX"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                WhatsApp
              </CardTitle>
              <CardDescription>Configure o número para receber pedidos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Número do WhatsApp (com DDD)</Label>
                <Input
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="5511999999999"
                />
                <p className="text-xs text-muted-foreground">
                  Formato: código do país + DDD + número (sem espaços ou traços)
                </p>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSavePayment} disabled={saving} className="w-full">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar Configurações de Pagamento
          </Button>
        </TabsContent>

        {/* Social Proof Tab */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Prova Social
              </CardTitle>
              <CardDescription>Configure as notificações de compras recentes exibidas na página</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Ativar Prova Social</Label>
                  <p className="text-xs text-muted-foreground">Exibir notificações de compras recentes</p>
                </div>
                <Switch
                  checked={socialProof.enabled}
                  onCheckedChange={(checked) => setSocialProof({ ...socialProof, enabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Nome do Produto</Label>
                <Input
                  value={socialProof.product_name}
                  onChange={(e) => setSocialProof({ ...socialProof, product_name: e.target.value })}
                  placeholder="o Gerador"
                />
                <p className="text-xs text-muted-foreground">Ex: "Carlos M. adquiriu <strong>o Gerador</strong>"</p>
              </div>

              <div className="space-y-2">
                <Label>Opções de Créditos (separados por vírgula)</Label>
                <Input
                  value={socialProof.credit_options.join(', ')}
                  onChange={(e) => setSocialProof({ 
                    ...socialProof, 
                    credit_options: e.target.value.split(',').map(v => Number(v.trim())).filter(v => !isNaN(v) && v > 0)
                  })}
                  placeholder="200, 500, 1000, 2000"
                />
                <p className="text-xs text-muted-foreground">Valores que aparecerão aleatoriamente nas notificações</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Clientes (Nomes Fictícios)</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSocialProof({
                      ...socialProof,
                      customers: [...socialProof.customers, { name: '', city: '', state: '', product: 'gerador' }]
                    })}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
                {socialProof.customers.map((customer, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_80px_100px_auto] gap-2 items-center">
                    <Input
                      value={customer.name}
                      onChange={(e) => {
                        const updated = [...socialProof.customers];
                        updated[index] = { ...updated[index], name: e.target.value };
                        setSocialProof({ ...socialProof, customers: updated });
                      }}
                      placeholder="Nome"
                    />
                    <Input
                      value={customer.city}
                      onChange={(e) => {
                        const updated = [...socialProof.customers];
                        updated[index] = { ...updated[index], city: e.target.value };
                        setSocialProof({ ...socialProof, customers: updated });
                      }}
                      placeholder="Cidade"
                    />
                    <Input
                      value={customer.state}
                      onChange={(e) => {
                        const updated = [...socialProof.customers];
                        updated[index] = { ...updated[index], state: e.target.value };
                        setSocialProof({ ...socialProof, customers: updated });
                      }}
                      placeholder="UF"
                    />
                    <select
                      value={customer.product || 'gerador'}
                      onChange={(e) => {
                        const updated = [...socialProof.customers];
                        updated[index] = { ...updated[index], product: e.target.value as 'gerador' | 'creditos' };
                        setSocialProof({ ...socialProof, customers: updated });
                      }}
                      className="h-10 rounded-md border border-input bg-background px-2 text-sm"
                    >
                      <option value="gerador">Gerador</option>
                      <option value="creditos">Créditos</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSocialProof({
                          ...socialProof,
                          customers: socialProof.customers.filter((_, i) => i !== index)
                        });
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button 
                onClick={async () => {
                  setSaving(true);
                  const result = await updateSetting('social_proof', socialProof);
                  if (result.success) {
                    toast.success('Prova social atualizada com sucesso!');
                  } else {
                    toast.error('Erro ao salvar: ' + result.error);
                  }
                  setSaving(false);
                }} 
                disabled={saving} 
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Salvar Prova Social
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Checkout Tab */}
        <TabsContent value="checkout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Página de Checkout
              </CardTitle>
              <CardDescription>Edite os textos e benefícios exibidos na página de checkout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Subtítulo do Produto</Label>
                  <Input
                    value={checkout.product_subtitle}
                    onChange={(e) => setCheckout({ ...checkout, product_subtitle: e.target.value })}
                    placeholder="Acesso Completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição do Produto</Label>
                  <Input
                    value={checkout.product_description}
                    onChange={(e) => setCheckout({ ...checkout, product_description: e.target.value })}
                    placeholder="Acesso vitalício • Sem mensalidades"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Texto do Badge</Label>
                  <Input
                    value={checkout.badge_text}
                    onChange={(e) => setCheckout({ ...checkout, badge_text: e.target.value })}
                    placeholder="Oferta Limitada"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Texto do Botão</Label>
                  <Input
                    value={checkout.button_text}
                    onChange={(e) => setCheckout({ ...checkout, button_text: e.target.value })}
                    placeholder="COMPRAR AGORA"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Benefícios (um por linha)</Label>
                <Textarea
                  value={checkout.benefits.join('\n')}
                  onChange={(e) => setCheckout({ ...checkout, benefits: e.target.value.split('\n').filter(b => b.trim()) })}
                  placeholder={"Acesso Vitalício ao Painel\nGerador de Créditos Ilimitado\nSuporte Premium 24/7"}
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">
                  Cada linha será exibida como um item com ícone ✓
                </p>
              </div>

              <Button 
                onClick={async () => {
                  setSaving(true);
                  const result = await updateSetting('checkout', checkout);
                  if (result.success) {
                    toast.success('Checkout atualizado com sucesso!');
                  } else {
                    toast.error('Erro ao salvar: ' + result.error);
                  }
                  setSaving(false);
                }} 
                disabled={saving} 
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Salvar Checkout
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guarantee Tab */}
        <TabsContent value="guarantee" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seção de Garantia</CardTitle>
              <CardDescription>Configure o título e os itens da seção de garantia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={guarantee.title}
                  onChange={(e) => setGuarantee({ ...guarantee, title: e.target.value })}
                  placeholder="Garantia"
                />
              </div>

              <div className="space-y-2">
                <Label>Itens da Garantia</Label>
                <p className="text-xs text-muted-foreground">Cada item será exibido como um bullet point na seção</p>
                {guarantee.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Textarea
                      value={item}
                      onChange={(e) => {
                        const updated = [...guarantee.items];
                        updated[index] = e.target.value;
                        setGuarantee({ ...guarantee, items: updated });
                      }}
                      rows={2}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = guarantee.items.filter((_, i) => i !== index);
                        setGuarantee({ ...guarantee, items: updated });
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGuarantee({ ...guarantee, items: [...guarantee.items, ''] })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>

              <Button
                onClick={async () => {
                  setSaving(true);
                  const result = await updateSetting('guarantee', guarantee);
                  if (result.success) {
                    toast.success('Garantia atualizada com sucesso!');
                  } else {
                    toast.error('Erro ao salvar: ' + result.error);
                  }
                  setSaving(false);
                }}
                disabled={saving}
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Salvar Garantia
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seção FAQ</CardTitle>
              <CardDescription>Configure as perguntas e respostas frequentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Título da Seção</Label>
                  <Input
                    value={faq.title}
                    onChange={(e) => setFaq({ ...faq, title: e.target.value })}
                    placeholder="Por que escolher o painel?"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtítulo</Label>
                  <Input
                    value={faq.subtitle}
                    onChange={(e) => setFaq({ ...faq, subtitle: e.target.value })}
                    placeholder="Tudo você precisa..."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Perguntas e Respostas</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFaq({ ...faq, items: [...faq.items, { question: '', answer: '' }] })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar FAQ
                  </Button>
                </div>
                {faq.items.map((item, index) => (
                  <Card key={index} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-2">
                        <Input
                          value={item.question}
                          onChange={(e) => {
                            const updated = [...faq.items];
                            updated[index] = { ...updated[index], question: e.target.value };
                            setFaq({ ...faq, items: updated });
                          }}
                          placeholder="Pergunta..."
                        />
                        <Textarea
                          value={item.answer}
                          onChange={(e) => {
                            const updated = [...faq.items];
                            updated[index] = { ...updated[index], answer: e.target.value };
                            setFaq({ ...faq, items: updated });
                          }}
                          placeholder="Resposta..."
                          rows={2}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updated = faq.items.filter((_, i) => i !== index);
                          setFaq({ ...faq, items: updated });
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <Button
                onClick={async () => {
                  setSaving(true);
                  const result = await updateSetting('faq', faq);
                  if (result.success) {
                    toast.success('FAQ atualizado com sucesso!');
                  } else {
                    toast.error('Erro ao salvar: ' + result.error);
                  }
                  setSaving(false);
                }}
                disabled={saving}
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Salvar FAQ
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
