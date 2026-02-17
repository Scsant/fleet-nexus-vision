import { useState } from "react";
import { ChevronDown, ChevronUp, Trophy } from "lucide-react";

interface VehicleRow {
  vehicle_license_plate: string;
  total_posicoes: number;
  posicoes_alerta: number;
  taxa_alerta: number;
  posicoes_prancha: number;
  posicoes_poligono: number;
}

interface VehicleTableProps {
  data: VehicleRow[];
  title: string;
}

const INITIAL_LIMIT = 10;

const VehicleTable = ({ data, title }: VehicleTableProps) => {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...data].sort((a, b) => b.taxa_alerta - a.taxa_alerta);
  const displayed = expanded ? sorted : sorted.slice(0, INITIAL_LIMIT);

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-neon-orange" />
          <h3 className="text-sm font-tech font-semibold gradient-neon-text uppercase tracking-wider">
            {title}
          </h3>
        </div>
        <span className="text-[10px] font-mono-tech text-muted-foreground">
          {displayed.length} de {sorted.length}
        </span>
      </div>
      <div className="overflow-x-auto scrollbar-dark max-h-[480px] overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-card z-10">
            <tr className="border-b border-border/30">
              <th className="px-4 py-3 text-left text-muted-foreground uppercase tracking-wider font-medium">#</th>
              <th className="px-4 py-3 text-left text-muted-foreground uppercase tracking-wider font-medium">Placa</th>
              <th className="px-4 py-3 text-right text-muted-foreground uppercase tracking-wider font-medium">Posições</th>
              <th className="px-4 py-3 text-right text-muted-foreground uppercase tracking-wider font-medium">Alertas</th>
              <th className="px-4 py-3 text-left text-muted-foreground uppercase tracking-wider font-medium min-w-[140px]">Taxa Alerta</th>
              <th className="px-4 py-3 text-right text-muted-foreground uppercase tracking-wider font-medium">Prancha</th>
              <th className="px-4 py-3 text-right text-muted-foreground uppercase tracking-wider font-medium">Polígono</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((row, i) => {
              const pct = row.taxa_alerta * 100;
              const isDanger = pct > 30;
              return (
                <tr
                  key={row.vehicle_license_plate}
                  className="border-b border-border/20 hover:bg-muted/30 transition-colors duration-200 group"
                >
                  <td className="px-4 py-3 text-muted-foreground font-mono-tech">
                    {i < 3 ? (
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold ${
                        i === 0 ? 'bg-neon-orange/20 text-neon-orange' :
                        i === 1 ? 'bg-muted text-foreground' :
                        'bg-neon-cyan/10 text-neon-cyan'
                      }`}>
                        {i + 1}
                      </span>
                    ) : (
                      i + 1
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono-tech font-semibold text-foreground group-hover:text-neon-green transition-colors">
                    {row.vehicle_license_plate}
                  </td>
                  <td className="px-4 py-3 text-right font-mono-tech text-muted-foreground">
                    {row.total_posicoes.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono-tech text-neon-red font-semibold">
                    {row.posicoes_alerta.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isDanger ? 'progress-bar-danger' : 'progress-bar-neon'}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <span className={`font-mono-tech font-semibold min-w-[42px] text-right ${isDanger ? 'text-neon-red' : 'text-neon-green'}`}>
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono-tech text-neon-orange">
                    {row.posicoes_prancha}
                  </td>
                  <td className="px-4 py-3 text-right font-mono-tech text-neon-cyan">
                    {row.posicoes_poligono}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {sorted.length > INITIAL_LIMIT && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-5 py-3 border-t border-border/30 flex items-center justify-center gap-2 text-xs font-mono-tech text-neon-blue hover:text-neon-green hover:bg-muted/20 transition-all duration-300"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              Mostrar Top 10
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              Ver todos ({sorted.length})
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default VehicleTable;
