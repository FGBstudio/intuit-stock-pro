import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import type { Tables } from "@/integrations/supabase/types";
import { Constants } from "@/integrations/supabase/types";

type Project = Tables<"projects">;
type Product = Tables<"products">;
type Allocation = Tables<"project_allocations">;

interface AllocationLine {
  id?: string;
  product_id: string;
  quantity: number;
  status: string;
}

interface ProjectFormData {
  name: string;
  client: string;
  region: string;
  handover_date: Date;
  status: string;
  pm_id: string;
  allocations: AllocationLine[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
  existingAllocations?: Allocation[];
  onSaved: () => void;
}

export function ProjectFormModal({ open, onOpenChange, project, existingAllocations = [], onSaved }: Props) {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [pmList, setPmList] = useState<{ id: string; full_name: string }[]>([]);
  const [saving, setSaving] = useState(false);

  const { register, control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: {
      name: "",
      client: "",
      region: "Europe",
      handover_date: new Date(),
      status: "Design",
      pm_id: "",
      allocations: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "allocations" });

  useEffect(() => {
    if (!open) return;
    // Fetch products
    supabase.from("products").select("*").then(({ data }) => setProducts(data || []));
    // Fetch PM list for admin
    if (isAdmin) {
      supabase.from("profiles").select("id, full_name").then(({ data }) => setPmList(data || []));
    }
  }, [open, isAdmin]);

  useEffect(() => {
    if (!open) return;
    if (project) {
      reset({
        name: project.name,
        client: project.client,
        region: project.region,
        handover_date: new Date(project.handover_date),
        status: project.status,
        pm_id: project.pm_id || "",
        allocations: existingAllocations.map((a) => ({
          id: a.id,
          product_id: a.product_id,
          quantity: a.quantity,
          status: a.status,
        })),
      });
    } else {
      reset({
        name: "",
        client: "",
        region: "Europe",
        handover_date: new Date(),
        status: "Design",
        pm_id: isAdmin ? "" : user?.id || "",
        allocations: [],
      });
    }
  }, [open, project, existingAllocations, reset, isAdmin, user]);

  const onSubmit = async (data: ProjectFormData) => {
    setSaving(true);
    try {
      const pmId = isAdmin ? data.pm_id : user?.id;
      const handoverStr = format(data.handover_date, "yyyy-MM-dd");

      let projectId = project?.id;

      if (project) {
        // Update project
        const { error } = await supabase
          .from("projects")
          .update({
            name: data.name,
            client: data.client,
            region: data.region as any,
            handover_date: handoverStr,
            status: data.status as any,
            pm_id: pmId || null,
          })
          .eq("id", project.id);
        if (error) throw error;
      } else {
        // Insert project
        const { data: newProject, error } = await supabase
          .from("projects")
          .insert({
            name: data.name,
            client: data.client,
            region: data.region as any,
            handover_date: handoverStr,
            status: data.status as any,
            pm_id: pmId || null,
          })
          .select("id")
          .single();
        if (error) throw error;
        projectId = newProject.id;
      }

      if (!projectId) throw new Error("Missing project ID");

      // Handle allocations: delete removed, upsert existing/new
      const existingIds = existingAllocations.map((a) => a.id);
      const currentIds = data.allocations.filter((a) => a.id).map((a) => a.id!);
      const toDelete = existingIds.filter((id) => !currentIds.includes(id));

      if (toDelete.length > 0) {
        await supabase.from("project_allocations").delete().in("id", toDelete);
      }

      for (const alloc of data.allocations) {
        const targetDate = format(
          new Date(data.handover_date.getTime() - 15 * 24 * 60 * 60 * 1000),
          "yyyy-MM-dd"
        );

        if (alloc.id) {
          await supabase
            .from("project_allocations")
            .update({
              product_id: alloc.product_id,
              quantity: alloc.quantity,
              status: alloc.status as any,
            })
            .eq("id", alloc.id);
        } else {
          await supabase.from("project_allocations").insert({
            project_id: projectId,
            product_id: alloc.product_id,
            quantity: alloc.quantity,
            status: (alloc.status || "Draft") as any,
            target_date: targetDate,
          });
        }
      }

      toast({ title: project ? "Progetto aggiornato" : "Progetto creato" });
      onOpenChange(false);
      onSaved();
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Modifica Progetto" : "Nuovo Progetto"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Project Data */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground border-b pb-2">Dati Cantiere</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome Progetto *</Label>
                <Input {...register("name", { required: true })} placeholder="es. Prada Milano" />
                {errors.name && <p className="text-xs text-destructive">Campo obbligatorio</p>}
              </div>
              <div className="space-y-2">
                <Label>Cliente *</Label>
                <Input {...register("client", { required: true })} placeholder="es. Prada" />
                {errors.client && <p className="text-xs text-destructive">Campo obbligatorio</p>}
              </div>
              <div className="space-y-2">
                <Label>Region</Label>
                <Controller
                  control={control}
                  name="region"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Constants.public.Enums.region.map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Handover Date *</Label>
                <Controller
                  control={control}
                  name="handover_date"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "dd MMM yyyy", { locale: it }) : "Seleziona data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Stato</Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Constants.public.Enums.project_status.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {isAdmin && (
                <div className="space-y-2">
                  <Label>Assegna PM</Label>
                  <Controller
                    control={control}
                    name="pm_id"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue placeholder="Seleziona PM" /></SelectTrigger>
                        <SelectContent>
                          {pmList.map((pm) => (
                            <SelectItem key={pm.id} value={pm.id}>{pm.full_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Allocations (Line Items) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold text-foreground">Articoli (Allocazioni Hardware)</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ product_id: "", quantity: 1, status: "Draft" })}
                className="gap-1"
              >
                <Plus className="h-4 w-4" /> Aggiungi Articolo
              </Button>
            </div>

            {fields.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Nessun articolo aggiunto. Clicca "Aggiungi Articolo" per iniziare.</p>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-3 rounded-lg border p-3">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-muted-foreground">Prodotto</Label>
                      <Controller
                        control={control}
                        name={`allocations.${index}.product_id`}
                        rules={{ required: true }}
                        render={({ field: f }) => (
                          <Select value={f.value} onValueChange={f.onChange}>
                            <SelectTrigger><SelectValue placeholder="Seleziona prodotto" /></SelectTrigger>
                            <SelectContent>
                              {products.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name} ({p.sku}) — Stock: {p.quantity_in_stock}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="w-24 space-y-1">
                      <Label className="text-xs text-muted-foreground">Qtà</Label>
                      <Input
                        type="number"
                        min="1"
                        {...register(`allocations.${index}.quantity`, { required: true, valueAsNumber: true, min: 1 })}
                      />
                    </div>
                    {isAdmin && (
                      <div className="w-36 space-y-1">
                        <Label className="text-xs text-muted-foreground">Stato</Label>
                        <Controller
                          control={control}
                          name={`allocations.${index}.status`}
                          render={({ field: f }) => (
                            <Select value={f.value} onValueChange={f.onChange}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {Constants.public.Enums.allocation_status.map((s) => (
                                  <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    )}
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annulla</Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {project ? "Salva Modifiche" : "Crea Progetto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
