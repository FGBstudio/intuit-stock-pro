import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { LowStockAlert } from "@/components/dashboard/LowStockAlert";
import { mockProducts, mockInboundOrders, mockOutboundOrders } from "@/data/mockData";
import { ArrowDownToLine, ArrowUpFromLine, Package, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const allOrders = [...mockInboundOrders, ...mockOutboundOrders]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const lowStockCount = mockProducts.filter(p => p.quantity <= p.minStock).length;
  const pendingInbound = mockInboundOrders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const pendingOutbound = mockOutboundOrders.filter(o => o.status === 'pending' || o.status === 'processing').length;

  return (
    <MainLayout title="Dashboard" subtitle="Panoramica del magazzino">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Totale Prodotti"
            value={mockProducts.length}
            icon={<Package className="h-6 w-6" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Ordini Inbound Attivi"
            value={pendingInbound}
            icon={<ArrowDownToLine className="h-6 w-6" />}
            variant="inbound"
          />
          <StatCard
            title="Ordini Outbound Attivi"
            value={pendingOutbound}
            icon={<ArrowUpFromLine className="h-6 w-6" />}
            variant="outbound"
          />
          <StatCard
            title="Allerte Stock"
            value={lowStockCount}
            icon={<AlertTriangle className="h-6 w-6" />}
            variant="warning"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentOrders orders={allOrders} />
          </div>
          <div>
            <LowStockAlert products={mockProducts} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
