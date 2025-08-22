import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  FileText, 
  Eye,
  Edit,
  Trash2,
  Download,
  Send,
  Calculator
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Mock data - Orçamentos do técnico logado
const technicianBudgets = [
  {
    id: "ORC-001",
    number: "ORC-001",
    client: "Empresa ABC Ltda",
    description: "Instalação de rede estruturada",
    totalValue: 15750.00,
    status: "pending",
    createdAt: "2024-01-15",
    validity: "2024-02-15"
  },
  {
    id: "ORC-002",
    number: "ORC-002", 
    client: "Comércio XYZ",
    description: "Manutenção preventiva",
    totalValue: 8950.00,
    status: "approved",
    createdAt: "2024-01-14",
    validity: "2024-02-20"
  }
];

// Mock materials for budget creation
const availableMaterials = [
  { id: 1, code: "MAT-001", description: "Cabo de Rede Cat6 - 305m", price: 630.00, unit: "Rolo" },
  { id: 2, code: "MAT-002", description: "Conectores RJ45 Cat6", price: 4.20, unit: "Unidade" },
  { id: 3, code: "MAT-003", description: "Switch 24 portas Gigabit", price: 1250.00, unit: "Unidade" },
  { id: 4, code: "MAT-004", description: "Patch Panel 24 portas", price: 185.00, unit: "Unidade" }
];

interface BudgetItem {
  materialId?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  total: number;
}

export default function TechnicianPortal() {
  const [budgets, setBudgets] = useState(technicianBudgets);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  // Form states
  const [clientName, setClientName] = useState("");
  const [clientCnpj, setClientCnpj] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [executionTime, setExecutionTime] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [validity, setValidity] = useState("");
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [laborCost, setLaborCost] = useState(0);
  const [discount, setDiscount] = useState(0);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('pt-BR');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="status-approved">Aprovado</Badge>;
      case "pending":
        return <Badge className="status-pending">Pendente</Badge>;
      case "rejected":
        return <Badge className="status-rejected">Reprovado</Badge>;
      default:
        return <Badge className="status-draft">Rascunho</Badge>;
    }
  };

  const addBudgetItem = () => {
    setBudgetItems([...budgetItems, {
      description: "",
      quantity: 1,
      unitPrice: 0,
      unit: "Unidade",
      total: 0
    }]);
  };

  const updateBudgetItem = (index: number, field: string, value: any) => {
    const newItems = [...budgetItems];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate total for this item
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setBudgetItems(newItems);
  };

  const removeBudgetItem = (index: number) => {
    setBudgetItems(budgetItems.filter((_, i) => i !== index));
  };

  const selectMaterial = (index: number, materialId: string) => {
    const material = availableMaterials.find(m => m.id === parseInt(materialId));
    if (material) {
      updateBudgetItem(index, 'materialId', material.id);
      updateBudgetItem(index, 'description', material.description);
      updateBudgetItem(index, 'unitPrice', material.price);
      updateBudgetItem(index, 'unit', material.unit);
      updateBudgetItem(index, 'total', budgetItems[index].quantity * material.price);
    }
  };

  const calculateTotals = () => {
    const materialsTotal = budgetItems.reduce((acc, item) => acc + item.total, 0);
    const subtotal = materialsTotal + laborCost;
    const total = subtotal - discount;
    return { materialsTotal, subtotal, total };
  };

  const resetForm = () => {
    setClientName("");
    setClientCnpj("");
    setServiceDescription("");
    setExecutionTime("");
    setPaymentTerms("");
    setValidity("");
    setBudgetItems([]);
    setLaborCost(0);
    setDiscount(0);
    setCurrentStep(1);
  };

  const handleCreateBudget = () => {
    const { total } = calculateTotals();
    const newBudget = {
      id: `ORC-${String(budgets.length + 1).padStart(3, '0')}`,
      number: `ORC-${String(budgets.length + 1).padStart(3, '0')}`,
      client: clientName,
      description: serviceDescription,
      totalValue: total,
      status: "pending",
      createdAt: new Date().toISOString().slice(0, 10),
      validity
    };

    setBudgets([newBudget, ...budgets]);
    toast({
      title: "Orçamento Criado",
      description: `O orçamento ${newBudget.number} foi criado e enviado para aprovação.`,
    });
    
    setShowCreateDialog(false);
    resetForm();
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Portal do Técnico</h1>
          <p className="text-muted-foreground">
            Gerencie seus orçamentos e serviços
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Orçamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Orçamento</DialogTitle>
            </DialogHeader>
            
            {/* Step Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    currentStep >= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>

            {/* Step 1: Client Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dados do Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Nome/Razão Social *</Label>
                    <Input
                      id="clientName"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Nome do cliente"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientCnpj">CNPJ/CPF</Label>
                    <Input
                      id="clientCnpj"
                      value={clientCnpj}
                      onChange={(e) => setClientCnpj(e.target.value)}
                      placeholder="12.345.678/0001-90"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceDescription">Descrição do Serviço *</Label>
                  <Textarea
                    id="serviceDescription"
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    placeholder="Descreva detalhadamente o serviço a ser executado"
                    rows={3}
                  /></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="executionTime">Prazo de Execução</Label>
                    <Input
                      id="executionTime"
                      value={executionTime}
                      onChange={(e) => setExecutionTime(e.target.value)}
                      placeholder="Ex: 15 dias úteis"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Condições de Pagamento</Label>
                    <Input
                      id="paymentTerms"
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      placeholder="Ex: 50% entrada, 50% conclusão"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validity">Validade</Label>
                    <Input
                      id="validity"
                      type="date"
                      value={validity}
                      onChange={(e) => setValidity(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Items */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Itens do Orçamento</h3>
                  <Button variant="outline" onClick={addBudgetItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>
                
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {budgetItems.map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="md:col-span-2 space-y-2">
                          <Label>Material/Serviço</Label>
                          <Select onValueChange={(value) => selectMaterial(index, value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecionar material..." />
                            </SelectTrigger>
                            <SelectContent>
                              {availableMaterials.map((material) => (
                                <SelectItem key={material.id} value={material.id.toString()}>
                                  {material.description} - {formatCurrency(material.price)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Ou digite descrição personalizada"
                            value={item.description}
                            onChange={(e) => updateBudgetItem(index, 'description', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Quantidade</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateBudgetItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Valor Unitário</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.unitPrice}
                            onChange={(e) => updateBudgetItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="space-y-2 flex-1">
                            <Label>Total</Label>
                            <div className="text-sm font-medium text-currency">
                              {formatCurrency(item.total)}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBudgetItem(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="laborCost">Mão de Obra</Label>
                    <Input
                      id="laborCost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={laborCost}
                      onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount">Desconto</Label>
                    <Input
                      id="discount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Resumo do Orçamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Cliente</h4>
                    <div className="text-sm space-y-1">
                      <p>{clientName}</p>
                      {clientCnpj && <p>CNPJ/CPF: {clientCnpj}</p>}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Condições</h4>
                    <div className="text-sm space-y-1">
                      <p>Prazo: {executionTime}</p>
                      <p>Pagamento: {paymentTerms}</p>
                      <p>Validade: {validity ? formatDate(validity) : 'Não informado'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Serviço</h4>
                  <p className="text-sm">{serviceDescription}</p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Totais</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Materiais:</span>
                      <span className="text-currency">{formatCurrency(totals.materialsTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mão de obra:</span>
                      <span className="text-currency">{formatCurrency(laborCost)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between">
                        <span>Desconto:</span>
                        <span className="text-currency">-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium text-base pt-2 border-t">
                      <span>Total Geral:</span>
                      <span className="text-currency">{formatCurrency(totals.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Anterior
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                {currentStep < 3 ? (
                  <Button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={
                      (currentStep === 1 && (!clientName || !serviceDescription)) ||
                      (currentStep === 2 && budgetItems.length === 0)
                    }
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button onClick={handleCreateBudget}>
                    <Send className="h-4 w-4 mr-2" />
                    Criar Orçamento
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budgets List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Meus Orçamentos</h2>
        {budgets.map((budget) => (
          <Card key={budget.id} className="card-elevated">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {budget.number}
                    {getStatusBadge(budget.status)}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {budget.client} • Criado em {formatDate(budget.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  {budget.status === 'draft' && (
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Descrição</p>
                  <p className="text-sm font-medium">{budget.description}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-sm font-medium text-currency">{formatCurrency(budget.totalValue)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Validade</p>
                  <p className="text-sm font-medium">{formatDate(budget.validity)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {budgets.length === 0 && (
        <Card className="card-elevated">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum orçamento criado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece criando seu primeiro orçamento para enviar aos clientes.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Orçamento
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}