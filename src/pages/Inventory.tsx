import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("products").select("*").order("name");
      setProducts(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <MainLayout title="Inventory" subtitle="Hardware stock levels and lead times">
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="stat-card">
                <p className="text-sm text-muted-foreground">{product.sku}</p>
                <p className="text-lg font-semibold text-foreground mt-1">{product.name}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline">{product.certification}</Badge>
                  <span className="text-2xl font-bold text-foreground">{product.quantity_in_stock}</span>
                  <span className="text-sm text-muted-foreground">in stock</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Lead time: {product.supplier_lead_time_days} days</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </MainLayout>
  );
}
