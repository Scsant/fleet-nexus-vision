import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from "recharts";
import { Building2, BarChart3, PieChart as PieIcon } from "lucide-react";

interface CityData {
  cidade: string;
  invasoes_total: number;
  caminhoes_unicos_total: number;
  invasoes_barreira: number;
  invasoes_poligono: number;
  caminhoes_unicos_barreira: number;
  caminhoes_unicos_poligono: number;
}

interface Props {
  data: CityData[];
}

const COLORS_BAR = [
  "hsl(168, 100%, 50%)", // neon-green
  "hsl(195, 100%, 50%)", // neon-blue
  "hsl(156, 100%, 50%)",
  "hsl(30, 100%, 55%)",  // neon-orange
  "hsl(185, 100%, 55%)", // neon-cyan
  "hsl(0, 100%, 55%)",   // neon-red
  "hsl(168, 80%, 40%)",
  "hsl(195, 80%, 40%)",
  "hsl(220, 60%, 50%)",
  "hsl(280, 60%, 50%)",
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-3 text-xs space-y-1 !bg-card/95 backdrop-blur-xl border border-glass-border/50">
      <p className="font-tech text-neon-green font-semibold text-sm">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-mono-tech text-muted-foreground">
          <span style={{ color: p.color }}>{p.name}:</span>{" "}
          <span className="text-foreground font-semibold">{p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

const CityInvasionsChart = ({ data }: Props) => {
  const [view, setView] = useState<"bar" | "pie">("bar");

  const top10 = [...data]
    .sort((a, b) => b.invasoes_total - a.invasoes_total)
    .slice(0, 10);

  // Pie data: aggregate barreira vs poligono
  const totalBarreira = data.reduce((s, d) => s + d.invasoes_barreira, 0);
  const totalPoligono = data.reduce((s, d) => s + d.invasoes_poligono, 0);
  const pieData = [
    { name: "Barreira", value: totalBarreira, fill: "hsl(30, 100%, 55%)" },
    { name: "Polígono", value: totalPoligono, fill: "hsl(195, 100%, 50%)" },
  ];

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-neon-cyan" />
          <h3 className="text-sm font-tech font-semibold gradient-neon-text uppercase tracking-wider">
            Invasões por Cidade
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setView("bar")}
            className={`p-2 rounded-lg transition-all duration-200 ${
              view === "bar" ? "bg-neon-green/10 text-neon-green" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setView("pie")}
            className={`p-2 rounded-lg transition-all duration-200 ${
              view === "pie" ? "bg-neon-green/10 text-neon-green" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {view === "bar" ? (
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={top10} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
              <XAxis
                type="number"
                tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
                axisLine={{ stroke: "hsl(210, 40%, 16%)" }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="cidade"
                width={120}
                tick={{ fill: "hsl(210, 40%, 92%)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(222, 47%, 12%)" }} />
              <Bar dataKey="invasoes_barreira" name="Barreira" stackId="a" radius={[0, 0, 0, 0]}>
                {top10.map((_, i) => (
                  <Cell key={i} fill="hsl(30, 100%, 55%)" fillOpacity={0.85} />
                ))}
              </Bar>
              <Bar dataKey="invasoes_poligono" name="Polígono" stackId="a" radius={[0, 4, 4, 0]}>
                {top10.map((_, i) => (
                  <Cell key={i} fill="hsl(195, 100%, 50%)" fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <ResponsiveContainer width={260} height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: entry.fill }} />
                  <div>
                    <p className="text-xs font-mono-tech text-foreground font-semibold">
                      {entry.value.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{entry.name}</p>
                  </div>
                </div>
              ))}
              <div className="mt-2 pt-2 border-t border-border/30">
                <p className="text-xs font-mono-tech text-muted-foreground">
                  Total: <span className="text-neon-green font-semibold">{(totalBarreira + totalPoligono).toLocaleString()}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mini legend for bar view */}
      {view === "bar" && (
        <div className="px-5 pb-4 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "hsl(30, 100%, 55%)" }} />
            <span className="text-[10px] font-mono-tech text-muted-foreground">Barreira</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "hsl(195, 100%, 50%)" }} />
            <span className="text-[10px] font-mono-tech text-muted-foreground">Polígono</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityInvasionsChart;
