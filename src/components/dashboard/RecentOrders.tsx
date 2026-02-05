import { Order } from "@/types/orders";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface RecentOrdersProps {
  orders: Order[];
}

const statusConfig = {
  pending: { label: "In Attesa", className: "bg-warning/10 text-warning border-warning/20" },
  processing: { label: "In Lavorazione", className: "bg-primary/10 text-primary border-primary/20" },
  completed: { label: "Completato", className: "bg-success/10 text-success border-success/20" },
  cancelled: { label: "Annullato", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="table-container">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-foreground">Ordini Recenti</h3>
        <p className="text-sm text-muted-foreground">Ultimi ordini inbound e outbound</p>
      </div>
      <div className="divide-y">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                order.type === "inbound" ? "bg-inbound/10" : "bg-outbound/10"
              )}>
                {order.type === "inbound" ? (
                  <ArrowDownToLine className="h-5 w-5 text-inbound" />
                ) : (
                  <ArrowUpFromLine className="h-5 w-5 text-outbound" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">{order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {order.type === "inbound" ? order.supplier : order.customer}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{order.totalQuantity} articoli</p>
                <p className="text-xs text-muted-foreground">
                  {format(order.expectedDate, "dd MMM yyyy", { locale: it })}
                </p>
              </div>
              <Badge variant="outline" className={cn("border", statusConfig[order.status].className)}>
                {statusConfig[order.status].label}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
