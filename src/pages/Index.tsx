import { 
  MapPin, AlertTriangle, Truck, BarChart3, 
  Hexagon, Target
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiCard from "@/components/dashboard/KpiCard";
import FleetMap from "@/components/dashboard/FleetMap";
import VehicleTable from "@/components/dashboard/VehicleTable";
import DriverTable from "@/components/dashboard/DriverTable";

import payloadData from "@/data/pbi_payload_completo.json";
import mapData from "@/data/pbi_mapa_alertas.json";

const Index = () => {
  const kpi = payloadData.kpi_geral[0];
  const vehicles = payloadData.por_veiculo;
  const drivers = payloadData.por_motorista;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 flex flex-col gap-6">
      <DashboardHeader />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <KpiCard
          title="Total Posições"
          value={kpi.total_posicoes_base.toLocaleString()}
          icon={<MapPin className="w-4 h-4" />}
          subtitle="posições rastreadas"
          delay={0}
        />
        <KpiCard
          title="Total Alertas"
          value={kpi.total_posicoes_alerta.toLocaleString()}
          icon={<AlertTriangle className="w-4 h-4" />}
          subtitle="posições em alerta"
          delay={80}
        />
        <KpiCard
          title="% Alertas"
          value={`${(kpi.pct_posicoes_alerta * 100).toFixed(1)}%`}
          icon={<BarChart3 className="w-4 h-4" />}
          subtitle="taxa geral"
          delay={160}
        />
        <KpiCard
          title="Caminhões"
          value={kpi.total_caminhoes_base}
          icon={<Truck className="w-4 h-4" />}
          subtitle="monitorados"
          delay={240}
        />
        <KpiCard
          title="Pos. Prancha"
          value={kpi.total_posicoes_prancha.toLocaleString()}
          icon={<Target className="w-4 h-4" />}
          subtitle="barreira prancha"
          delay={320}
        />
        <KpiCard
          title="Pos. Polígono"
          value={kpi.total_posicoes_poligono.toLocaleString()}
          icon={<Hexagon className="w-4 h-4" />}
          subtitle="dentro polígono"
          delay={400}
        />
      </div>

      {/* Map */}
      <FleetMap data={mapData as any} />

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <VehicleTable data={vehicles} title="Ranking Veículos" />
        <DriverTable data={drivers} />
      </div>
    </div>
  );
};

export default Index;
