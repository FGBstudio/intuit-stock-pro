import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "inbound" | "outbound" | "warning";
  className?: string;
}

export function StatCard({ title, value, icon, trend, variant = "default", className }: StatCardProps) {
  const variantStyles = {
    default: "border-l-primary",
    inbound: "border-l-inbound",
    outbound: "border-l-outbound",
    warning: "border-l-warning",
  };

  return (
    <div className={cn(
      "stat-card border-l-4 animate-fade-in",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{Math.abs(trend.value)}% vs mese scorso</span>
            </div>
          )}
        </div>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          variant === "inbound" && "bg-inbound/10 text-inbound",
          variant === "outbound" && "bg-outbound/10 text-outbound",
          variant === "warning" && "bg-warning/10 text-warning",
          variant === "default" && "bg-primary/10 text-primary"
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
}
