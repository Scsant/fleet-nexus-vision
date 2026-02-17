import { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  delay?: number;
}

const KpiCard = ({ title, value, icon, subtitle, delay = 0 }: KpiCardProps) => {
  return (
    <div
      className="glass-card-hover p-5 flex flex-col gap-3 opacity-0 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {title}
        </span>
        <div className="w-9 h-9 rounded-lg gradient-card flex items-center justify-center text-neon-green">
          {icon}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-3xl font-tech font-bold gradient-neon-text leading-none">
          {value}
        </span>
        {subtitle && (
          <span className="text-xs text-muted-foreground font-mono-tech">
            {subtitle}
          </span>
        )}
      </div>
      <div className="h-[2px] w-full rounded-full overflow-hidden bg-muted">
        <div className="h-full progress-bar-neon rounded-full" style={{ width: "60%" }} />
      </div>
    </div>
  );
};

export default KpiCard;
