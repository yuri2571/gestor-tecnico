import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Filter,
  Download,
  Package,
  Edit,
  Trash2,
  QrCode
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data - Em produção viria do localStorage ou API
const materials = [
  {
    id: 1,
    code: "MAT-001",
    description: "Cabo de Rede Cat6 - 305m",
    unit: "Rolo",
    cost: 450.00,
    price: 630.00,
    stock: 15,
    minStock: 5,
    ncm: "85444290",
    active: true
  },
  {
    id: 2,
    code: "MAT-002", 
    description: "Conectores RJ45 Cat6",
    unit: "Unidade",
    cost: 2.50,
    price: 4.20,
    stock: 8,
    minStock: 20,
    ncm: "85366990",
    active: true
  },
  {
    id: 3,
    code: "MAT-003",
    description: "Switch 24 portas Gigabit",
    unit: "Unidade", 
    cost: 890.00,
    price: 1250.00,
    stock: 3,
    minStock: 5,
    ncm: "85176990",
    active: true
  },
  {
    id: 4,
    code: "MAT-004",
    description: "Patch Panel 24 portas",
    unit: "Unidade",
    cost: 125.00,
    price: 185.00,
    stock: 12,
    minStock: 8,
    ncm: "85389099",
    active: true
  }
];

export default function MaterialsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLowStock = !showLowStock || material.stock <= material.minStock;
    return matchesSearch && matchesLowStock;
  });

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const getStockStatus = (current: number, minimum: number) => {
    if (current <= minimum) {
      return <Badge className="status-rejected">Baixo</Badge>;
    } else if (current <= minimum * 1.5) {
      return <Badge className="status-pending">Atenção</Badge>;
    }
    return <Badge className="status-approved">OK</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Materiais</h1>
          <p className="text-muted-foreground">
            Gerencie o cadastro de materiais e controle de estoque
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Material
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="card-elevated">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={showLowStock ? "default" : "outline"}
                size="sm"
                onClick={() => setShowLowStock(!showLowStock)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Estoque Baixo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Table */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lista de Materiais ({filteredMaterials.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Custo</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>NCM</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-mono font-medium">
                      {material.code}
                    </TableCell>
                    <TableCell className="font-medium">
                      {material.description}
                    </TableCell>
                    <TableCell>{material.unit}</TableCell>
                    <TableCell className="text-currency">
                      {formatCurrency(material.cost)}
                    </TableCell>
                    <TableCell className="text-currency font-medium">
                      {formatCurrency(material.price)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={material.stock <= material.minStock ? "text-destructive font-medium" : ""}>
                          {material.stock}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          / {material.minStock} min
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStockStatus(material.stock, material.minStock)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {material.ncm}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-light rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Materiais</p>
                <p className="text-xl font-bold">{materials.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning-light rounded-lg">
                <Package className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estoque Baixo</p>
                <p className="text-xl font-bold">
                  {materials.filter(m => m.stock <= m.minStock).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success-light rounded-lg">
                <Package className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-xl font-bold text-currency">
                  {formatCurrency(materials.reduce((acc, m) => acc + (m.price * m.stock), 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}