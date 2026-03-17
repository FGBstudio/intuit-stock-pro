import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { mockProjects, mockAllocations, mockProducts } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Region, ProjectStatus } from "@/types/index";

const statusColors: Record<ProjectStatus, string> = {
  Design: "bg-primary/10 text-primary border-primary/20",
  Construction: "bg-warning/10 text-warning border-warning/20",
  Completed: "bg-success/10 text-success border-success/20",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Projects() {
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("all");

  const filtered = mockProjects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = regionFilter === "all" || p.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  return (
    <MainLayout title="Projects" subtitle="Construction site management by region">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="Europe">Europe</SelectItem>
              <SelectItem value="America">America</SelectItem>
              <SelectItem value="APAC">APAC</SelectItem>
              <SelectItem value="ME">ME</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="table-container overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-muted-foreground">Project</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Client</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Region</th>
                <th className="text-left p-4 font-medium text-muted-foreground">PM</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Handover</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Allocations</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => {
                const allocs = mockAllocations.filter((a) => a.projectId === project.id);
                const totalQty = allocs.reduce((s, a) => s + a.quantity, 0);
                const daysLeft = Math.ceil((new Date(project.handoverDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

                return (
                  <tr key={project.id} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium text-foreground">{project.name}</td>
                    <td className="p-4 text-foreground">{project.client}</td>
                    <td className="p-4"><Badge variant="outline">{project.region}</Badge></td>
                    <td className="p-4 text-foreground">{project.pm}</td>
                    <td className="p-4">
                      <span className={cn("font-medium", daysLeft <= 30 ? "text-warning" : "text-foreground")}>
                        {format(new Date(project.handoverDate), "dd MMM yyyy", { locale: it })}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">({daysLeft}gg)</span>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={cn("border", statusColors[project.status])}>
                        {project.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-foreground">{totalQty} units</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
