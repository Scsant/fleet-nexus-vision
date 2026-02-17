import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPoint {
  vehicle_license_plate: string;
  timestamp: string;
  location_latitude: number;
  location_longitude: number;
  intersecta_barreira_prancha: boolean;
  dentro_poligono_cidade: boolean;
  posicao_com_alerta: boolean;
}

interface FleetMapProps {
  data: MapPoint[];
}

const createAlertIcon = (hasPrancha: boolean, hasPoligono: boolean) => {
  let borderColor = "#ff3355";
  if (hasPrancha) borderColor = "#ff8800";
  if (hasPoligono) borderColor = "#00c2ff";
  if (hasPrancha && hasPoligono) borderColor = "#ff8800";

  return L.divIcon({
    className: "",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    html: `
      <div style="position:relative;width:18px;height:18px;">
        <div class="marker-pulse" style="position:absolute;inset:-4px;border-radius:50%;background:rgba(255,51,85,0.3);"></div>
        <div style="width:18px;height:18px;border-radius:50%;background:radial-gradient(circle,#ff5577,#cc0033);border:2px solid ${borderColor};box-shadow:0 0 12px rgba(255,51,85,0.6);"></div>
      </div>
    `,
  });
};

const normalIcon = L.divIcon({
  className: "",
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  html: `<div style="width:10px;height:10px;border-radius:50%;background:radial-gradient(circle,#00ffb3,#00aa77);border:1px solid rgba(0,255,179,0.4);opacity:0.7;"></div>`,
});

const FleetMap = ({ data }: FleetMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [-22.3, -49.5],
      zoom: 8,
      zoomControl: true,
      attributionControl: true,
    });

    // Dark tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    mapInstance.current = map;

    // Add markers
    const alertPoints: MapPoint[] = [];
    const normalPoints: MapPoint[] = [];

    data.forEach((pt) => {
      if (pt.posicao_com_alerta) {
        alertPoints.push(pt);
      } else {
        normalPoints.push(pt);
      }
    });

    // Normal markers first (background)
    normalPoints.forEach((pt) => {
      L.marker([pt.location_latitude, pt.location_longitude], { icon: normalIcon })
        .addTo(map);
    });

    // Alert markers on top
    alertPoints.forEach((pt) => {
      const icon = createAlertIcon(pt.intersecta_barreira_prancha, pt.dentro_poligono_cidade);
      const marker = L.marker([pt.location_latitude, pt.location_longitude], { icon })
        .addTo(map);

      const statusTags: string[] = [];
      if (pt.intersecta_barreira_prancha) statusTags.push("Prancha");
      if (pt.dentro_poligono_cidade) statusTags.push("Polígono");

      const tooltipContent = `
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.5;">
          <div style="font-weight:700;color:#00ffb3;margin-bottom:2px;">${pt.vehicle_license_plate}</div>
          <div style="color:#8899aa;">${new Date(pt.timestamp).toLocaleString("pt-BR")}</div>
          ${statusTags.length ? `<div style="margin-top:4px;display:flex;gap:4px;">${statusTags.map(s => `<span style="background:${s === 'Prancha' ? 'rgba(255,136,0,0.2)' : 'rgba(0,194,255,0.2)'};color:${s === 'Prancha' ? '#ff8800' : '#00c2ff'};padding:1px 6px;border-radius:4px;font-size:10px;">${s}</span>`).join("")}</div>` : ""}
        </div>
      `;

      marker.bindTooltip(tooltipContent, {
        className: "dark-tooltip",
        direction: "top",
        offset: [0, -12],
      });
    });

    // Fit bounds
    if (data.length > 0) {
      const bounds = L.latLngBounds(data.map((pt) => [pt.location_latitude, pt.location_longitude]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [data]);

  return (
    <div className="glass-card overflow-hidden relative">
      <div className="absolute top-4 left-4 z-[1000] flex items-center gap-4">
        <div className="glass-card px-3 py-1.5 flex items-center gap-2 text-[10px]">
          <div className="w-2.5 h-2.5 rounded-full bg-neon-red animate-pulse-glow" />
          <span className="text-muted-foreground">Alertas</span>
          <span className="font-mono-tech text-neon-red font-semibold">
            {data.filter((d) => d.posicao_com_alerta).length}
          </span>
        </div>
        <div className="glass-card px-3 py-1.5 flex items-center gap-2 text-[10px]">
          <div className="w-2.5 h-2.5 rounded-full bg-neon-green opacity-70" />
          <span className="text-muted-foreground">Normal</span>
          <span className="font-mono-tech text-neon-green font-semibold">
            {data.filter((d) => !d.posicao_com_alerta).length}
          </span>
        </div>
      </div>
      <div ref={mapRef} className="w-full h-[500px] lg:h-[600px]" />
    </div>
  );
};

export default FleetMap;
