import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { Order, OrderItem, OrderType } from "@/types/orders";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const orderItemSchema = z.object({
  id: z.string(),
  productId: z.string().min(1, "Seleziona un prodotto"),
  productName: z.string().min(1, "Nome prodotto richiesto"),
  sku: z.string().min(1, "SKU richiesto"),
  quantity: z.number().min(1, "Quantità minima 1"),
  unitPrice: z.number().optional(),
});

const orderFormSchema = z.object({
  orderNumber: z.string().min(1, "Numero ordine richiesto"),
  supplierOrCustomer: z.string().min(1, "Campo richiesto"),
  status: z.enum(["pending", "processing", "completed", "cancelled"]),
  expectedDate: z.date({ required_error: "Data prevista richiesta" }),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "Aggiungi almeno un articolo"),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

interface OrderFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: Order | null;
  type: OrderType;
  onSave: (order: Order) => void;
}

const mockProducts = [
  { id: "1", name: "Laptop Dell XPS 15", sku: "DELL-XPS15-001", unitPrice: 1299.99 },
  { id: "2", name: "Mouse Logitech MX Master", sku: "LOG-MXM-002", unitPrice: 89.99 },
  { id: "3", name: "Tastiera Meccanica RGB", sku: "KEY-RGB-003", unitPrice: 149.99 },
  { id: "4", name: "Monitor 27\" 4K", sku: "MON-4K27-004", unitPrice: 449.99 },
  { id: "5", name: "Webcam HD Pro", sku: "CAM-HD-005", unitPrice: 79.99 },
  { id: "6", name: "Cuffie Wireless", sku: "AUD-WL-006", unitPrice: 199.99 },
  { id: "7", name: "Docking Station USB-C", sku: "DOCK-USBC-007", unitPrice: 179.99 },
  { id: "8", name: "SSD 1TB NVMe", sku: "SSD-1TB-008", unitPrice: 129.99 },
];

export function OrderFormModal({ open, onOpenChange, order, type, onSave }: OrderFormModalProps) {
  const isEditing = !!order;
  const isInbound = type === "inbound";

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: order
      ? {
          orderNumber: order.orderNumber,
          supplierOrCustomer: isInbound ? order.supplier || "" : order.customer || "",
          status: order.status,
          expectedDate: new Date(order.expectedDate),
          notes: order.notes || "",
          items: order.items,
        }
      : {
          orderNumber: `${isInbound ? "IN" : "OUT"}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
          supplierOrCustomer: "",
          status: "pending",
          expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          notes: "",
          items: [],
        },
  });

  const items = form.watch("items");

  const addItem = () => {
    const currentItems = form.getValues("items");
    form.setValue("items", [
      ...currentItems,
      {
        id: crypto.randomUUID(),
        productId: "",
        productName: "",
        sku: "",
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    form.setValue(
      "items",
      currentItems.filter((_, i) => i !== index)
    );
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (product) {
      form.setValue(`items.${index}.productId`, product.id);
      form.setValue(`items.${index}.productName`, product.name);
      form.setValue(`items.${index}.sku`, product.sku);
      form.setValue(`items.${index}.unitPrice`, product.unitPrice);
    }
  };

  const onSubmit = (data: OrderFormValues) => {
    const newOrder: Order = {
      id: order?.id || crypto.randomUUID(),
      orderNumber: data.orderNumber,
      type,
      status: data.status,
      supplier: isInbound ? data.supplierOrCustomer : undefined,
      customer: !isInbound ? data.supplierOrCustomer : undefined,
      items: data.items as OrderItem[],
      totalQuantity: data.items.reduce((sum, item) => sum + item.quantity, 0),
      createdAt: order?.createdAt || new Date(),
      expectedDate: data.expectedDate,
      notes: data.notes,
    };

    onSave(newOrder);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifica Ordine" : "Nuovo Ordine"} {isInbound ? "Inbound" : "Outbound"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica i dettagli dell'ordine"
              : `Crea un nuovo ordine ${isInbound ? "di arrivo merce" : "di spedizione"}`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="orderNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numero Ordine</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="IN-2024-001" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stato</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona stato" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">In Attesa</SelectItem>
                        <SelectItem value="processing">In Lavorazione</SelectItem>
                        <SelectItem value="completed">Completato</SelectItem>
                        <SelectItem value="cancelled">Annullato</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="supplierOrCustomer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isInbound ? "Fornitore" : "Cliente"}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={isInbound ? "Nome fornitore" : "Nome cliente"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Prevista</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd MMMM yyyy", { locale: it })
                            ) : (
                              <span>Seleziona data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base">Articoli</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Aggiungi
                </Button>
              </div>

              {items.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg text-muted-foreground">
                  Nessun articolo. Clicca "Aggiungi" per iniziare.
                </div>
              )}

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-3 items-end p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="col-span-5">
                      <FormLabel className="text-xs">Prodotto</FormLabel>
                      <Select
                        value={item.productId}
                        onValueChange={(value) => handleProductSelect(index, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona prodotto" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <FormLabel className="text-xs">SKU</FormLabel>
                      <Input value={item.sku} disabled className="bg-background" />
                    </div>
                    <div className="col-span-2">
                      <FormLabel className="text-xs">Quantità</FormLabel>
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          form.setValue(`items.${index}.quantity`, parseInt(e.target.value) || 1)
                        }
                      />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {form.formState.errors.items && (
                <p className="text-sm text-destructive">{form.formState.errors.items.message}</p>
              )}
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Note aggiuntive sull'ordine..." rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Summary */}
            {items.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Totale Articoli</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Quantità Totale</span>
                  <span className="font-medium">
                    {items.reduce((sum, item) => sum + (item.quantity || 0), 0)} unità
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annulla
              </Button>
              <Button type="submit">{isEditing ? "Salva Modifiche" : "Crea Ordine"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
