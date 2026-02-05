import { Product } from "@/types/orders";
import { AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LowStockAlertProps {
  products: Product[];
}

export function LowStockAlert({ products }: LowStockAlertProps) {
  const lowStockProducts = products.filter(p => p.quantity <= p.minStock);

  if (lowStockProducts.length === 0) {
    return null;
  }

  return (
    <div className="table-container">
      <div className="p-4 border-b flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-warning" />
        <div>
          <h3 className="font-semibold text-foreground">Allerta Stock Basso</h3>
          <p className="text-sm text-muted-foreground">Prodotti sotto la soglia minima</p>
        </div>
      </div>
      <div className="divide-y">
        {lowStockProducts.map((product) => {
          const stockPercentage = (product.quantity / product.minStock) * 100;
          return (
            <div key={product.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-foreground">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-warning">{product.quantity} unità</p>
                  <p className="text-xs text-muted-foreground">Min: {product.minStock}</p>
                </div>
              </div>
              <Progress 
                value={stockPercentage} 
                className="h-2 bg-muted"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
