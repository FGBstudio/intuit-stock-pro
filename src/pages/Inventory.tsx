import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { mockProducts } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Download } from "lucide-react";
import { Product } from "@/types/orders";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Inventory() {
  const [products] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout title="Inventario" subtitle="Gestione prodotti e stock">
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Cerca prodotti o SKU..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le categorie</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Esporta
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuovo Prodotto
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg p-4 border">
            <p className="text-sm text-muted-foreground">Prodotti Totali</p>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <p className="text-sm text-muted-foreground">Stock Totale</p>
            <p className="text-2xl font-bold">{products.reduce((sum, p) => sum + p.quantity, 0)}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <p className="text-sm text-muted-foreground">Valore Inventario</p>
            <p className="text-2xl font-bold">
              €{products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <p className="text-sm text-muted-foreground">Stock Basso</p>
            <p className="text-2xl font-bold text-warning">
              {products.filter(p => p.quantity <= p.minStock).length}
            </p>
          </div>
        </div>

        {/* Table */}
        <InventoryTable products={filteredProducts} />
      </div>
    </MainLayout>
  );
}
