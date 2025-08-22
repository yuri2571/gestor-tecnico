import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  ShoppingCart, 
  FileText, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";
import dashboardHero from "@/assets/dashboard-hero.jpg";

const stats = [
  {
    name: "Valor do Estoque",
    value: "R$ 1.234.567,89",
    change: "+12.5%",
    changeType: "positive",
    icon: Package,
  },
  {
    name: "Compras do Mês",
    value: "R$ 89.456,23",
    change: "+8.2%",
    changeType: "positive",
    icon: ShoppingCart,
  },
  {
    name: "Orçamentos Pendentes",
    value: "23",
    change: "+5",
    changeType: "neutral",
    icon: FileText,
  },
  {
    name: "Taxa de Aprovação",
    value: "87.5%",
    change: "+3.1%",
    changeType: "positive",
    icon: TrendingUp,
  },
];

const recentBudgets = [
  {
    id: "ORC-001",
    technician: "João Silva",
    client: "Empresa ABC Ltda",
    value: "R$ 15.750,00",
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: "ORC-002", 
    technician: "Maria Santos",
    client: "Comércio XYZ",
    value: "R$ 8.950,00",
    status: "approved",
    date: "2024-01-14",
  },
  {
    id: "ORC-003",
    technician: "Pedro Costa",
    client: "Indústria DEF",
    value: "R$ 32.100,00",
    status: "rejected",
    date: "2024-01-13",
  },
];

const lowStockAlerts = [
  { material: "Cabo de Rede Cat6", current: 5, minimum: 10 },
  { material: "Conectores RJ45", current: 8, minimum: 20 },
  { material: "Switch 24 portas", current: 2, minimum: 5 },
];

export default function Dashboard() {
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

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-hover">
        <div className="absolute inset-0">
          <img
            src={dashboardHero}
            alt="Dashboard"
            className="h-full w-full object-cover opacity-20"
          />
        </div>
        <div className="relative px-6 py-12 sm:px-12 sm:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Sistema de Gestão de Materiais
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/90">
              Controle completo de estoque, compras e orçamentos dos técnicos terceiros.
              Gerencie seu negócio de forma eficiente e profissional.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="secondary" size="lg">
                Novo Material
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                Ver Relatórios
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-sm ${
                      stat.changeType === "positive" 
                        ? "text-success" 
                        : stat.changeType === "negative"
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}>
                      {stat.change} desde o mês passado
                    </p>
                  </div>
                  <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Budgets */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Orçamentos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBudgets.map((budget) => (
                <div
                  key={budget.id}
                  className="flex items-center justify-between p-4 border border-card-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{budget.id}</span>
                      {getStatusBadge(budget.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {budget.technician} • {budget.client}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(budget.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-currency">{budget.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver Todos os Orçamentos
            </Button>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Alertas de Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-warning/20 bg-warning-light rounded-lg"
                >
                  <div>
                    <p className="font-medium">{alert.material}</p>
                    <p className="text-sm text-muted-foreground">
                      Estoque atual: {alert.current} | Mínimo: {alert.minimum}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Comprar
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver Todos os Alertas
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Package className="h-6 w-6" />
              Cadastrar Material
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <ShoppingCart className="h-6 w-6" />
              Nova Compra
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText className="h-6 w-6" />
              Novo Orçamento
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <CheckCircle className="h-6 w-6" />
              Aprovar Orçamentos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}