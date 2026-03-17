import { MainLayout } from "@/components/layout/MainLayout";
import { mockProducts } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

export default function Inventory() {
  return (
    <MainLayout title="Inventory" subtitle="Hardware stock levels and lead times">
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {mockProducts.map((product) => (
            <div key={product.id} className="stat-card">
              <p className="text-sm text-muted-foreground">{product.sku}</p>
              <p className="text-lg font-semibold text-foreground mt-1">{product.name}</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline">{product.certification}</Badge>
                <span className="text-2xl font-bold text-foreground">{product.quantityInStock}</span>
                <span className="text-sm text-muted-foreground">in stock</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Lead time: {product.supplierLeadTimeDays} days</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
