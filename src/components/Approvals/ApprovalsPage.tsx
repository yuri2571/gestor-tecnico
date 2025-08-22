import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  XCircle, 
  Eye,
  FileText,
  Calendar,
  User,
  Building,
  DollarSign,
  Clock
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Mock data - Em produção viria do localStorage ou API
const pendingBudgets = [
  {
    id: "ORC-001",
    number: "ORC-001",
    technician: {
      name: "João Silva",
      company: "TechServ Ltda"
    },
    client: {
      name: "Empresa ABC Ltda",
      cnpj: "12.345.678/0001-90"
    },
    description: "Instalação de rede estruturada para 50 pontos",
    totalValue: 15750.00,
    materialsCost: 8500.00,
    laborCost: 6250.00,
    discount: 0,
    validity: "2024-02-15",
    executionTime: "15 dias úteis",
    paymentTerms: "50% entrada, 50% na conclusão",
    status: "pending",
    createdAt: "2024-01-15T10:30:00Z",
    items: [
      { description: "Cabo de Rede Cat6", qty: 2, unit: "Rolo", unitPrice: 630.00, total: 1260.00 },
      { description: "Conectores RJ45", qty: 100, unit: "Unidade", unitPrice: 4.20, total: 420.00 },
      { description: "Patch Panel 24 portas", qty: 3, unit: "Unidade", unitPrice: 185.00, total: 555.00 },
      { description: "Switch 24 portas", qty: 3, unit: "Unidade", unitPrice: 1250.00, total: 3750.00 },
      { description: "Mão de obra especializada", qty: 1, unit: "Serviço", unitPrice: 6250.00, total: 6250.00 }
    ]
  },
  {
    id: "ORC-002",
    number: "ORC-002", 
    technician: {
      name: "Maria Santos",
      company: "NetWork Pro"
    },
    client: {
      name: "Comércio XYZ",
      cnpj: "98.765.432/0001-10"
    },
    description: "Manutenção preventiva em equipamentos de rede",
    totalValue: 8950.00,
    materialsCost: 3200.00,
    laborCost: 5750.00,
    discount: 0,
    validity: "2024-02-20",
    executionTime: "5 dias úteis",
    paymentTerms: "À vista com desconto de 5%",
    status: "pending",
    createdAt: "2024-01-14T14:15:00Z",
    items: [
      { description: "Limpeza especializada", qty: 1, unit: "Serviço", unitPrice: 2500.00, total: 2500.00 },
      { description: "Substituição de cabos", qty: 1, unit: "Serviço", unitPrice: 3250.00, total: 3250.00 },
      { description: "Materiais diversos", qty: 1, unit: "Lote", unitPrice: 3200.00, total: 3200.00 }
    ]
  }
];

export default function ApprovalsPage() {
  const [budgets, setBudgets] = useState(pendingBudgets);
  const [selectedBudget, setSelectedBudget] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('pt-BR');

  const handleApprove = (budgetId: string) => {
    setBudgets(prev => prev.map(budget => 
      budget.id === budgetId 
        ? { ...budget, status: 'approved' }
        : budget
    ));
    
    toast({
      title: "Orçamento Aprovado",
      description: `O orçamento ${budgetId} foi aprovado com sucesso.`,
      variant: "default"
    });
  };

  const handleReject = (budgetId: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Motivo Obrigatório",
        description: "É necessário informar o motivo da reprovação.",
        variant: "destructive"
      });
      return;
    }

    setBudgets(prev => prev.map(budget => 
      budget.id === budgetId 
        ? { ...budget, status: 'rejected', rejectionReason }
        : budget
    ));
    
    toast({
      title: "Orçamento Reprovado",
      description: `O orçamento ${budgetId} foi reprovado.`,
      variant: "default"
    });
    
    setRejectionReason("");
    setShowRejectionDialog(false);
    setSelectedBudget(null);
  };

  const pendingCount = budgets.filter(b => b.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Aprovações de Orçamentos</h1>
          <p className="text-muted-foreground">
            {pendingCount} orçamento{pendingCount !== 1 ? 's' : ''} aguardando aprovação
          </p>
        </div>
      </div>

      {/* Pending Budgets */}
      <div className="space-y-4">
        {budgets.filter(budget => budget.status === 'pending').map((budget) => (
          <Card key={budget.id} className="card-elevated">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {budget.number}
                    <Badge className="status-pending">Pendente</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Criado em {formatDate(budget.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Detalhes do Orçamento {budget.number}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Client and Technician Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              Cliente
                            </h3>
                            <div className="space-y-1">
                              <p className="font-medium">{budget.client.name}</p>
                              <p className="text-sm text-muted-foreground">CNPJ: {budget.client.cnpj}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Técnico
                            </h3>
                            <div className="space-y-1">
                              <p className="font-medium">{budget.technician.name}</p>
                              <p className="text-sm text-muted-foreground">{budget.technician.company}</p>
                            </div>
                          </div>
                        </div>

                        {/* Service Description */}
                        <div className="space-y-3">
                          <h3 className="font-semibold">Descrição do Serviço</h3>
                          <p className="text-sm">{budget.description}</p>
                        </div>

                        {/* Items */}
                        <div className="space-y-3">
                          <h3 className="font-semibold">Itens do Orçamento</h3>
                          <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="text-left p-3 text-sm font-medium">Descrição</th>
                                  <th className="text-center p-3 text-sm font-medium">Qtd</th>
                                  <th className="text-center p-3 text-sm font-medium">Unidade</th>
                                  <th className="text-right p-3 text-sm font-medium">Valor Unit.</th>
                                  <th className="text-right p-3 text-sm font-medium">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {budget.items.map((item, index) => (
                                  <tr key={index} className="border-t">
                                    <td className="p-3 text-sm">{item.description}</td>
                                    <td className="p-3 text-sm text-center">{item.qty}</td>
                                    <td className="p-3 text-sm text-center">{item.unit}</td>
                                    <td className="p-3 text-sm text-right text-currency">
                                      {formatCurrency(item.unitPrice)}
                                    </td>
                                    <td className="p-3 text-sm text-right font-medium text-currency">
                                      {formatCurrency(item.total)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Prazos e Condições
                            </h3>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-medium">Validade:</span> {formatDate(budget.validity)}</p>
                              <p><span className="font-medium">Prazo de Execução:</span> {budget.executionTime}</p>
                              <p><span className="font-medium">Condições:</span> {budget.paymentTerms}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Valores
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Materiais:</span>
                                <span className="text-currency">{formatCurrency(budget.materialsCost)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Mão de obra:</span>
                                <span className="text-currency">{formatCurrency(budget.laborCost)}</span>
                              </div>
                              <div className="flex justify-between font-medium text-base pt-2 border-t">
                                <span>Total:</span>
                                <span className="text-currency">{formatCurrency(budget.totalValue)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    className="btn-approve"
                    size="sm"
                    onClick={() => handleApprove(budget.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprovar
                  </Button>
                  
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedBudget(budget);
                      setShowRejectionDialog(true);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reprovar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{budget.technician.name}</p>
                    <p className="text-xs text-muted-foreground">{budget.technician.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{budget.client.name}</p>
                    <p className="text-xs text-muted-foreground">Cliente</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-currency">{formatCurrency(budget.totalValue)}</p>
                    <p className="text-xs text-muted-foreground">Valor Total</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{formatDate(budget.validity)}</p>
                    <p className="text-xs text-muted-foreground">Validade</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Descrição:</span> {budget.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pendingCount === 0 && (
        <Card className="card-elevated">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-success mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum orçamento pendente</h3>
            <p className="text-muted-foreground text-center">
              Todos os orçamentos foram processados. Novos orçamentos aparecerão aqui quando criados pelos técnicos.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprovar Orçamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Informe o motivo da reprovação do orçamento {selectedBudget?.number}:
            </p>
            <Textarea
              placeholder="Digite o motivo da reprovação..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectionDialog(false);
                  setRejectionReason("");
                  setSelectedBudget(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedBudget && handleReject(selectedBudget.id)}
              >
                Reprovar Orçamento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}