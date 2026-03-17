import { MainLayout } from "@/components/layout/MainLayout";
import { mockSupplierOrders, mockProducts } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { it } from "date-fns/locale";

const statusColors: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground border-border",
  Sent: "bg-primary/10 text-primary border-primary/20",
  In_Transit: "bg-warning/10 text-warning border-warning/20",
  Received: "bg-success/10 text-success border-success/20",
};

export default function SupplierOrders() {
  return (
    <MainLayout title="Supplier Orders" subtitle="Track procurement and incoming stock">
      <div className="table-container overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-medium text-muted-foreground">Order ID</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Supplier</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Product</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Qty</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Expected Delivery</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockSupplierOrders.map((order) => {
              const product = mockProducts.find((p) => p.id === order.productId);
              return (
                <tr key={order.id} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-medium text-foreground">{order.id.toUpperCase()}</td>
                  <td className="p-4 text-foreground">{order.supplierName}</td>
                  <td className="p-4 text-foreground">{product?.name ?? order.productId}</td>
                  <td className="p-4 text-foreground">{order.quantityRequested}</td>
                  <td className="p-4 text-foreground">
                    {format(new Date(order.expectedDeliveryDate), "dd MMM yyyy", { locale: it })}
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className={cn("border", statusColors[order.status])}>
                      {order.status.replace("_", " ")}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
