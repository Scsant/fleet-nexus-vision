import {
  RadialBarChart, RadialBar, ResponsiveContainer, Tooltip,
} from "recharts";
import { ShieldAlert } from "lucide-react";

interface Props {
  totalPosicoes: number;
  totalAlertas: number;
  posPrancha: number;
  posPoligono: number;
}

const AlertDistributionChart = ({ totalPosicoes, totalAlertas, posPrancha, posPoligono }: Props) => {
  const pctAlerta = ((totalAlertas / totalPosicoes) * 100);
  const pctPrancha = ((posPrancha / totalPosicoes) * 100);
  const pctPoligono = ((posPoligono / totalPosicoes) * 100);

  const radialData = [
    { name: "Polígono", value: pctPoligono, fill: "hsl(195, 100%, 50%)" },
    { name: "Prancha", value: pctPrancha, fill: "hsl(30, 100%, 55%)" },
    { name: "Alertas", value: pctAlerta, fill: "hsl(0, 100%, 55%)" },
  ];

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-neon-red" />
        <h3 className="text-sm font-tech font-semibold gradient-neon-text uppercase tracking-wider">
          Distribuição de Alertas
        </h3>
      </div>
      <div className="p-4 flex flex-col items-center">
        <ResponsiveContainer width="100%" height={220}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="30%"
            outerRadius="100%"
            data={radialData}
            startAngle={180}
            endAngle={0}
            barSize={14}
          >
            <RadialBar
              background={{ fill: "hsl(222, 47%, 18%)" }}
              dataKey="value"
              cornerRadius={8}
              label={{
                position: "insideStart",
                fill: "hsl(210, 40%, 92%)",
                fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
                formatter: (val: number) => `${val.toFixed(1)}%`,
              }}
            />
            <Tooltip
              formatter={(val: number) => `${val.toFixed(2)}%`}
              contentStyle={{
                background: "hsl(222, 47%, 8%)",
                border: "1px solid hsl(210, 40%, 20%)",
                borderRadius: "8px",
                fontSize: "11px",
                fontFamily: "'JetBrains Mono', monospace",
                color: "hsl(210, 40%, 92%)",
              }}
              labelStyle={{ color: "hsl(210, 40%, 80%)" }}
              itemStyle={{ color: "hsl(210, 40%, 92%)" }}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          {radialData.reverse().map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
              <span className="text-[10px] font-mono-tech text-muted-foreground">{d.name}</span>
              <span className="text-[10px] font-mono-tech text-foreground font-semibold">
                {d.value.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertDistributionChart;
