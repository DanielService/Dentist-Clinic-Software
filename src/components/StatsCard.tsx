import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "primary" | "success" | "warning";
}

const variantStyles = {
  default: "bg-card border-border",
  primary: "bg-primary text-primary-foreground border-primary",
  success: "bg-success-light border-success/20",
  warning: "bg-warning-light border-warning/20",
};

const iconStyles = {
  default: "bg-primary-light text-primary",
  primary: "bg-primary-foreground/20 text-primary-foreground",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
};

const titleStyles = {
  default: "text-muted-foreground",
  primary: "text-primary-foreground/80",
  success: "text-success",
  warning: "text-warning",
};

const valueStyles = {
  default: "text-foreground",
  primary: "text-primary-foreground",
  success: "text-foreground",
  warning: "text-foreground",
};

export function StatsCard({ title, value, subtitle, icon: Icon, variant = "default" }: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5 shadow-[var(--shadow-card)] flex items-center gap-4",
        variantStyles[variant]
      )}
    >
      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", iconStyles[variant])}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className={cn("text-sm font-medium", titleStyles[variant])}>{title}</p>
        <p className={cn("text-2xl font-bold leading-tight", valueStyles[variant])}>{value}</p>
        {subtitle && (
          <p className={cn("text-xs mt-0.5", variant === "primary" ? "text-primary-foreground/70" : "text-muted-foreground")}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
