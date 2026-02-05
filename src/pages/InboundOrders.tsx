import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrderFormModal } from "@/components/orders/OrderFormModal";
import { mockInboundOrders } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { Order, OrderStatus } from "@/types/orders";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InboundOrders() {
  const [orders, setOrders] = useState<Order[]>(mockInboundOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
    toast({
      title: "Stato aggiornato",
      description: `L'ordine è stato aggiornato a "${status}"`,
    });
  };

  const handleSaveOrder = (order: Order) => {
    setOrders(prev => {
      const exists = prev.find(o => o.id === order.id);
      if (exists) {
        return prev.map(o => o.id === order.id ? order : o);
      }
      return [order, ...prev];
    });
    toast({
      title: editingOrder ? "Ordine modificato" : "Ordine creato",
      description: `Ordine ${order.orderNumber} ${editingOrder ? "aggiornato" : "creato"} con successo`,
    });
    setEditingOrder(null);
  };

  const handleViewOrder = (order: Order) => {
    setEditingOrder(order);
    setModalOpen(true);
  };

  const handleNewOrder = () => {
    setEditingOrder(null);
    setModalOpen(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout title="Ordini Inbound" subtitle="Gestione arrivi merce">
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Cerca ordini..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Stato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli stati</SelectItem>
                <SelectItem value="pending">In Attesa</SelectItem>
                <SelectItem value="processing">In Lavorazione</SelectItem>
                <SelectItem value="completed">Completato</SelectItem>
                <SelectItem value="cancelled">Annullato</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="gap-2" onClick={handleNewOrder}>
            <Plus className="h-4 w-4" />
            Nuovo Ordine
          </Button>
        </div>

        {/* Table */}
        <OrdersTable 
          orders={filteredOrders} 
          onStatusChange={handleStatusChange}
          onView={handleViewOrder}
        />

        {/* Modal */}
        <OrderFormModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          order={editingOrder}
          type="inbound"
          onSave={handleSaveOrder}
        />
      </div>
    </MainLayout>
  );
}
