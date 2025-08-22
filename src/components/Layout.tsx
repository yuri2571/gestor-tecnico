import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Home,
  Truck,
  ClipboardCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Materiais", href: "/materials", icon: Package },
  { name: "Movimentações", href: "/movements", icon: Truck },
  { name: "Compras", href: "/purchases", icon: ShoppingCart },
  { name: "Envios", href: "/shipments", icon: Truck },
  { name: "Técnicos", href: "/technicians", icon: Users },
  { name: "Orçamentos", href: "/budgets", icon: FileText },
  { name: "Aprovações", href: "/approvals", icon: ClipboardCheck },
  { name: "Relatórios", href: "/reports", icon: BarChart3 },
  { name: "Configurações", href: "/settings", icon: Settings },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border shadow-lg">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-lg font-bold text-sidebar-foreground">Sistema de Gestão</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="mt-4 px-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-sidebar border-r border-sidebar-border">
        <div className="flex h-16 items-center px-4 border-b border-sidebar-border">
          <h1 className="text-lg font-bold text-sidebar-foreground">Sistema de Gestão</h1>
        </div>
        <nav className="mt-4 flex-1 px-2 pb-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-card-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="text-sm text-muted-foreground">
                Bem-vindo ao Sistema de Gestão
              </div>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
              <Button variant="outline" size="sm">
                Técnico Terceiro
              </Button>
              <Button variant="default" size="sm">
                Admin
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}