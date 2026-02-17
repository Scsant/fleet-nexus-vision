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

const VehicleTable = ({ data, title }: VehicleTableProps) => {
  const sorted = [...data].sort((a, b) => b.taxa_alerta - a.taxa_alerta);

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border/50">
        <h3 className="text-sm font-tech font-semibold gradient-neon-text uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="overflow-x-auto scrollbar-dark">
        <table className="w-full text-xs">
          <thead>
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
            {sorted.map((row, i) => {
              const pct = (row.taxa_alerta * 100);
              const isDanger = pct > 30;
              return (
                <tr
                  key={row.vehicle_license_plate}
                  className="border-b border-border/20 hover:bg-muted/30 transition-colors duration-200"
                >
                  <td className="px-4 py-3 text-muted-foreground font-mono-tech">{i + 1}</td>
                  <td className="px-4 py-3 font-mono-tech font-semibold text-foreground">
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
    </div>
  );
};

export default VehicleTable;
