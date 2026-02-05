import { Order, OrderStatus } from "@/types/orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Eye, MoreHorizontal, CheckCircle, XCircle, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrdersTableProps {
  orders: Order[];
  onStatusChange?: (orderId: string, status: OrderStatus) => void;
  onView?: (order: Order) => void;
}

const statusConfig = {
  pending: { label: "In Attesa", className: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  processing: { label: "In Lavorazione", className: "bg-primary/10 text-primary border-primary/20", icon: Clock },
  completed: { label: "Completato", className: "bg-success/10 text-success border-success/20", icon: CheckCircle },
  cancelled: { label: "Annullato", className: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
};

export function OrdersTable({ orders, onStatusChange, onView }: OrdersTableProps) {
  return (
    <div className="table-container">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold">Ordine</TableHead>
            <TableHead className="font-semibold">Fornitore/Cliente</TableHead>
            <TableHead className="font-semibold text-center">Articoli</TableHead>
            <TableHead className="font-semibold">Data Prevista</TableHead>
            <TableHead className="font-semibold">Stato</TableHead>
            <TableHead className="font-semibold text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon;
            return (
              <TableRow key={order.id} className="group">
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      Creato: {format(order.createdAt, "dd/MM/yyyy", { locale: it })}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-foreground">
                    {order.type === "inbound" ? order.supplier : order.customer}
                  </p>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-muted text-sm font-medium">
                    {order.totalQuantity}
                  </span>
                </TableCell>
                <TableCell>
                  <p className="text-foreground">
                    {format(order.expectedDate, "dd MMM yyyy", { locale: it })}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("border gap-1", statusConfig[order.status].className)}>
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig[order.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onView?.(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onStatusChange?.(order.id, 'processing')}>
                          Segna In Lavorazione
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange?.(order.id, 'completed')}>
                          Segna Completato
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onStatusChange?.(order.id, 'cancelled')}
                          className="text-destructive"
                        >
                          Annulla Ordine
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
