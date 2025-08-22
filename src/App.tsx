import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import MaterialsList from "./components/Materials/MaterialsList";
import ApprovalsPage from "./components/Approvals/ApprovalsPage";
import TechnicianPortal from "./components/Technician/TechnicianPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="materials" element={<MaterialsList />} />
            <Route path="movements" element={<div className="p-6">Movimentações - Em desenvolvimento</div>} />
            <Route path="purchases" element={<div className="p-6">Compras - Em desenvolvimento</div>} />
            <Route path="shipments" element={<div className="p-6">Envios - Em desenvolvimento</div>} />
            <Route path="technicians" element={<TechnicianPortal />} />
            <Route path="budgets" element={<div className="p-6">Orçamentos - Em desenvolvimento</div>} />
            <Route path="approvals" element={<ApprovalsPage />} />
            <Route path="reports" element={<div className="p-6">Relatórios - Em desenvolvimento</div>} />
            <Route path="settings" element={<div className="p-6">Configurações - Em desenvolvimento</div>} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
