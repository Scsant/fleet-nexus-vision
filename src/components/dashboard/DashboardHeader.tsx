import { Activity, Filter } from "lucide-react";

const DashboardHeader = () => {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-1">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg gradient-neon flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-tech font-bold gradient-neon-text leading-tight">
            Central de Monitoramento
          </h1>
          <p className="text-xs text-muted-foreground font-mono-tech mt-0.5">
            Operacional • Frota em Tempo Real
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="glass-card px-3 py-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Filter className="w-3.5 h-3.5" />
          <span className="font-mono-tech">16 Nov 2025 — 16 Fev 2026</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
        <span className="text-xs text-neon-green font-mono-tech">LIVE</span>
      </div>
    </header>
  );
};

export default DashboardHeader;
