import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'accent';
  trend?: { value: number; label: string };
}

const variantStyles = {
  default: 'border-l-muted-foreground',
  success: 'border-l-success',
  warning: 'border-l-warning',
  destructive: 'border-l-destructive',
  accent: 'border-l-accent',
};

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
  accent: 'bg-accent/10 text-accent',
};

export function KPICard({ title, value, icon: Icon, variant = 'default', trend }: KPICardProps) {
  return (
    <div className={cn(
      "bg-card rounded-xl shadow-card p-5 border-l-4 hover:shadow-card-hover transition-shadow duration-200",
      variantStyles[variant]
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              trend.value >= 0 ? "text-success" : "text-destructive"
            )}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconStyles[variant])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
