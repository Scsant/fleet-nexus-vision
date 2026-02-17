import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Layers, Shield, Hexagon } from "lucide-react";

import barreirasPolygonData from "@/data/barreiras_poligonos_cidades.geojson";
import barreirasPranchaData from "@/data/barreiras_prancha.geojson";

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

const TILE_LAYERS: Record<string, { url: string; label: string }> = {
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    label: "Dark",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    label: "Satélite",
  },
  topo: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    label: "Topográfico",
  },
  streets: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    label: "Ruas",
  },
};

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
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const polygonLayerRef = useRef<L.GeoJSON | null>(null);
  const pranchaLayerRef = useRef<L.GeoJSON | null>(null);
  const [activeLayer, setActiveLayer] = useState("dark");
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [showPolygons, setShowPolygons] = useState(true);
  const [showPrancha, setShowPrancha] = useState(true);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [-22.3, -49.5],
      zoom: 8,
      zoomControl: true,
      attributionControl: true,
    });

    const tile = L.tileLayer(TILE_LAYERS.dark.url, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tile;
    mapInstance.current = map;

    // GeoJSON: Polígonos de cidades
    const polygonLayer = L.geoJSON(barreirasPolygonData as any, {
      style: {
        color: "#00c2ff",
        weight: 2,
        opacity: 0.7,
        fillColor: "#00c2ff",
        fillOpacity: 0.1,
        dashArray: "4 4",
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties?.NOME) {
          layer.bindTooltip(
            `<div style="font-family:'JetBrains Mono',monospace;font-size:11px;">
              <span style="color:#00c2ff;font-weight:700;">Polígono</span><br/>
              <span style="color:#ccc;">${feature.properties.NOME}</span>
            </div>`,
            { className: "dark-tooltip", direction: "top" }
          );
        }
      },
    }).addTo(map);
    polygonLayerRef.current = polygonLayer;

    // GeoJSON: Barreiras prancha
    const pranchaLayer = L.geoJSON(barreirasPranchaData as any, {
      style: {
        color: "#ff8800",
        weight: 3,
        opacity: 0.8,
        lineCap: "round",
      },
      onEachFeature: (feature, layer) => {
        const name = feature.properties?.NOME_MUNICIPIO || feature.properties?.cidade || "";
        if (name) {
          layer.bindTooltip(
            `<div style="font-family:'JetBrains Mono',monospace;font-size:11px;">
              <span style="color:#ff8800;font-weight:700;">Barreira Prancha</span><br/>
              <span style="color:#ccc;">${name}</span>
            </div>`,
            { className: "dark-tooltip", direction: "top" }
          );
        }
      },
    }).addTo(map);
    pranchaLayerRef.current = pranchaLayer;

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

    normalPoints.forEach((pt) => {
      L.marker([pt.location_latitude, pt.location_longitude], { icon: normalIcon }).addTo(map);
    });

    alertPoints.forEach((pt) => {
      const icon = createAlertIcon(pt.intersecta_barreira_prancha, pt.dentro_poligono_cidade);
      const marker = L.marker([pt.location_latitude, pt.location_longitude], { icon }).addTo(map);

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

    if (data.length > 0) {
      const bounds = L.latLngBounds(data.map((pt) => [pt.location_latitude, pt.location_longitude]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [data]);

  // Toggle GeoJSON layers
  useEffect(() => {
    if (!mapInstance.current) return;
    if (polygonLayerRef.current) {
      if (showPolygons) polygonLayerRef.current.addTo(mapInstance.current);
      else polygonLayerRef.current.remove();
    }
  }, [showPolygons]);

  useEffect(() => {
    if (!mapInstance.current) return;
    if (pranchaLayerRef.current) {
      if (showPrancha) pranchaLayerRef.current.addTo(mapInstance.current);
      else pranchaLayerRef.current.remove();
    }
  }, [showPrancha]);

  const switchLayer = (key: string) => {
    if (!mapInstance.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(TILE_LAYERS[key].url);
    setActiveLayer(key);
  };

  const alertCount = data.filter((d) => d.posicao_com_alerta).length;
  const normalCount = data.filter((d) => !d.posicao_com_alerta).length;

  return (
    <div className="glass-card overflow-hidden relative">
      {/* Legend */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-wrap items-center gap-2">
        <div className="glass-card px-3 py-1.5 flex items-center gap-2 text-[10px] !bg-card/90 backdrop-blur-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-neon-red animate-pulse-glow" />
          <span className="text-muted-foreground">Alertas</span>
          <span className="font-mono-tech text-neon-red font-semibold">{alertCount}</span>
        </div>
        <div className="glass-card px-3 py-1.5 flex items-center gap-2 text-[10px] !bg-card/90 backdrop-blur-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-neon-green opacity-70" />
          <span className="text-muted-foreground">Normal</span>
          <span className="font-mono-tech text-neon-green font-semibold">{normalCount}</span>
        </div>
      </div>

      {/* Layer control */}
      <div className="absolute top-4 right-4 z-[1000]">
        <button
          onClick={() => setShowLayerPanel(!showLayerPanel)}
          className="glass-card !bg-card/90 backdrop-blur-xl p-2.5 hover:border-neon-blue/40 transition-all duration-200"
        >
          <Layers className="w-4 h-4 text-neon-blue" />
        </button>
        {showLayerPanel && (
          <div className="absolute top-12 right-0 glass-card !bg-card/95 backdrop-blur-xl p-3 min-w-[180px] space-y-3">
            {/* Tile layers */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono-tech">Mapa Base</span>
              {Object.entries(TILE_LAYERS).map(([key, layer]) => (
                <button
                  key={key}
                  onClick={() => switchLayer(key)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-all duration-200 ${
                    activeLayer === key
                      ? "bg-neon-green/10 text-neon-green"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  {layer.label}
                </button>
              ))}
            </div>

            <div className="border-t border-border/30" />

            {/* GeoJSON toggles */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono-tech">Camadas</span>
              <button
                onClick={() => setShowPolygons(!showPolygons)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono-tech flex items-center gap-2 transition-all duration-200 ${
                  showPolygons ? "bg-[#00c2ff]/10 text-[#00c2ff]" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <Hexagon className="w-3 h-3" />
                Polígonos Cidades
              </button>
              <button
                onClick={() => setShowPrancha(!showPrancha)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono-tech flex items-center gap-2 transition-all duration-200 ${
                  showPrancha ? "bg-[#ff8800]/10 text-[#ff8800]" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <Shield className="w-3 h-3" />
                Barreiras Prancha
              </button>
            </div>
          </div>
        )}
      </div>

      <div ref={mapRef} className="w-full h-[500px] lg:h-[600px]" />
    </div>
  );
};

export default FleetMap;
