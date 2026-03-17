import { MainLayout } from "@/components/layout/MainLayout";
import { mockProducts, mockProjects, mockAllocations, mockSupplierOrders } from "@/data/mockData";
import { generateProcurementAlerts, getAtRiskProjects, getInstallationBacklog } from "@/services/forecasting";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShoppingCart, Clock, Truck, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export default function Dashboard() {
  const alerts = generateProcurementAlerts({
    products: mockProducts,
    projects: mockProjects,
    allocations: mockAllocations,
    supplierOrders: mockSupplierOrders,
  });

  const atRiskProjects = getAtRiskProjects(mockProjects, mockAllocations, mockProducts);
  const installationBacklog = getInstallationBacklog(mockAllocations, mockProjects, mockProducts);

  const formatDate = (iso: string) => format(new Date(iso), "dd MMM yyyy", { locale: it });
  const formatMonth = (ym: string) => {
    const [y, m] = ym.split("-");
    return format(new Date(parseInt(y), parseInt(m) - 1), "MMMM yyyy", { locale: it });
  };

  const isOverdue = (date: string) => new Date(date) < new Date();

  return (
    <MainLayout title="Supply Chain Command Center" subtitle="Procurement alerts · At-risk projects · Installation backlog">
      <div className="space-y-8">

        {/* SECTION 1: Procurement Alerts */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Actionable Procurement Alerts</h2>
            {alerts.length > 0 && (
              <Badge variant="destructive" className="ml-2">{alerts.length}</Badge>
            )}
          </div>

          {alerts.length === 0 ? (
            <div className="table-container p-6 text-center text-muted-foreground">
              Nessun alert di approvvigionamento. Lo stock copre tutte le allocazioni future.
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => {
                const overdue = isOverdue(alert.dropDeadDate);
                const projectNames = alert.affectedProjects
                  .map((pid) => mockProjects.find((p) => p.id === pid)?.name)
                  .filter(Boolean);

                return (
                  <div
                    key={alert.id}
                    className={cn(
                      "table-container p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                      overdue && "border-destructive/50 bg-destructive/5"
                    )}
                  >
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-foreground">
                        <span className="text-destructive font-semibold">Azione Richiesta:</span>{" "}
                        Ordina <span className="font-bold">{alert.shortfall}×</span>{" "}
                        <span className="font-bold">{alert.productName}</span> per{" "}
                        <Badge variant="outline" className="mx-1">{alert.region}</Badge>{" "}
                        entro il <span className={cn("font-semibold", overdue ? "text-destructive" : "text-warning")}>
                          {formatDate(alert.dropDeadDate)}
                        </span>{" "}
                        per coprire le aperture di {formatMonth(alert.month)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Cantieri: {projectNames.join(", ")}
                      </p>
                    </div>
                    <Button size="sm" className="gap-2 shrink-0">
                      <ShoppingCart className="h-4 w-4" />
                      Crea Ordine Fornitore
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 2: At-Risk Projects */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-4 w-4 text-warning" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">At-Risk Projects</h2>
            <span className="text-sm text-muted-foreground ml-2">Handover entro 30 giorni con criticità</span>
          </div>

          {atRiskProjects.length === 0 ? (
            <div className="table-container p-6 text-center text-muted-foreground">
              Nessun cantiere a rischio nei prossimi 30 giorni.
            </div>
          ) : (
            <div className="table-container overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium text-muted-foreground">Progetto</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Cliente</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Region</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">PM</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Handover</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Criticità</th>
                  </tr>
                </thead>
                <tbody>
                  {atRiskProjects.map((project) => {
                    const daysLeft = Math.ceil(
                      (new Date(project.handoverDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <tr key={project.id} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-medium text-foreground">{project.name}</td>
                        <td className="p-4 text-foreground">{project.client}</td>
                        <td className="p-4">
                          <Badge variant="outline">{project.region}</Badge>
                        </td>
                        <td className="p-4 text-foreground">{project.pm}</td>
                        <td className="p-4">
                          <span className={cn("font-medium", daysLeft <= 7 ? "text-destructive" : "text-warning")}>
                            {formatDate(project.handoverDate)}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">({daysLeft}gg)</span>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">
                            {project.reason}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* SECTION 3: Installation Backlog */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Truck className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Installation Backlog</h2>
            <span className="text-sm text-muted-foreground ml-2">Shipped → da installare, raggruppati per PM</span>
          </div>

          {installationBacklog.length === 0 ? (
            <div className="table-container p-6 text-center text-muted-foreground">
              Nessun prodotto in attesa di installazione.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {installationBacklog.map(({ pm, items }) => (
                <div key={pm} className="table-container">
                  <div className="p-4 border-b flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">{pm}</h3>
                    <Badge variant="secondary" className="ml-auto">{items.length} items</Badge>
                  </div>
                  <div className="divide-y">
                    {items.map((item, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                        <div>
                          <p className="font-medium text-foreground">{item.projectName}</p>
                          <p className="text-sm text-muted-foreground">{item.productName} × {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Target</p>
                          <p className="text-sm font-medium text-foreground">{formatDate(item.targetDate)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
