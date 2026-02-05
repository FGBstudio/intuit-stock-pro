import { Product } from "@/types/orders";
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
import { Edit2, MoreHorizontal, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InventoryTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
}

export function InventoryTable({ products, onEdit }: InventoryTableProps) {
  const getStockStatus = (product: Product) => {
    if (product.quantity <= 0) return { label: "Esaurito", className: "bg-destructive/10 text-destructive border-destructive/20" };
    if (product.quantity <= product.minStock) return { label: "Basso", className: "bg-warning/10 text-warning border-warning/20" };
    return { label: "Disponibile", className: "bg-success/10 text-success border-success/20" };
  };

  return (
    <div className="table-container">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold">Prodotto</TableHead>
            <TableHead className="font-semibold">SKU</TableHead>
            <TableHead className="font-semibold">Categoria</TableHead>
            <TableHead className="font-semibold text-center">Quantità</TableHead>
            <TableHead className="font-semibold">Posizione</TableHead>
            <TableHead className="font-semibold">Stato</TableHead>
            <TableHead className="font-semibold text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const stockStatus = getStockStatus(product);
            return (
              <TableRow key={product.id} className="group">
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      €{product.unitPrice.toFixed(2)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-sm bg-muted px-2 py-1 rounded">{product.sku}</code>
                </TableCell>
                <TableCell>
                  <span className="text-foreground">{product.category}</span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <span className={cn(
                      "text-lg font-semibold",
                      product.quantity <= product.minStock ? "text-warning" : "text-foreground"
                    )}>
                      {product.quantity}
                    </span>
                    <span className="text-xs text-muted-foreground">min: {product.minStock}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="text-sm">{product.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("border", stockStatus.className)}>
                    {stockStatus.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit?.(product)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Registra Movimento</DropdownMenuItem>
                        <DropdownMenuItem>Visualizza Storico</DropdownMenuItem>
                        <DropdownMenuItem>Stampa Etichetta</DropdownMenuItem>
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
