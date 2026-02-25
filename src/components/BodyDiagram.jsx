import { useState } from "react";
import { Label } from "./ui/label";

/**
 * Componente de diagrama del cuerpo humano interactivo
 * Permite seleccionar zonas de lesión haciendo clic en áreas del cuerpo
 */
export function BodyDiagram({ value = {}, onChange }) {
  const [selectedZones, setSelectedZones] = useState(value || {});

  // Definición de zonas del cuerpo con sus posiciones relativas
  const bodyZones = [
    { id: "cabeza", label: "Cabeza", x: 50, y: 8, width: 12, height: 12 },
    { id: "cuello", label: "Cuello", x: 50, y: 20, width: 8, height: 5 },
    { id: "hombro_der", label: "Hombro Derecho", x: 35, y: 25, width: 10, height: 8 },
    { id: "hombro_izq", label: "Hombro Izquierdo", x: 65, y: 25, width: 10, height: 8 },
    { id: "torax", label: "Tórax", x: 50, y: 35, width: 20, height: 18 },
    { id: "abdomen", label: "Abdomen", x: 50, y: 53, width: 18, height: 12 },
    { id: "brazo_der", label: "Brazo Derecho", x: 28, y: 35, width: 8, height: 25 },
    { id: "brazo_izq", label: "Brazo Izquierdo", x: 72, y: 35, width: 8, height: 25 },
    { id: "antebrazo_der", label: "Antebrazo Derecho", x: 25, y: 60, width: 7, height: 18 },
    { id: "antebrazo_izq", label: "Antebrazo Izquierdo", x: 75, y: 60, width: 7, height: 18 },
    { id: "mano_der", label: "Mano Derecha", x: 23, y: 78, width: 6, height: 8 },
    { id: "mano_izq", label: "Mano Izquierda", x: 77, y: 78, width: 6, height: 8 },
    { id: "pelvis", label: "Pelvis", x: 50, y: 65, width: 16, height: 8 },
    { id: "muslo_der", label: "Muslo Derecho", x: 42, y: 73, width: 8, height: 20 },
    { id: "muslo_izq", label: "Muslo Izquierdo", x: 58, y: 73, width: 8, height: 20 },
    { id: "rodilla_der", label: "Rodilla Derecha", x: 42, y: 93, width: 8, height: 6 },
    { id: "rodilla_izq", label: "Rodilla Izquierda", x: 58, y: 93, width: 8, height: 6 },
    { id: "pierna_der", label: "Pierna Derecha", x: 42, y: 99, width: 7, height: 18 },
    { id: "pierna_izq", label: "Pierna Izquierda", x: 58, y: 99, width: 7, height: 18 },
    { id: "pie_der", label: "Pie Derecho", x: 41, y: 117, width: 8, height: 6 },
    { id: "pie_izq", label: "Pie Izquierdo", x: 58, y: 117, width: 8, height: 6 },
  ];

  const toggleZone = (zoneId) => {
    const newSelectedZones = {
      ...selectedZones,
      [zoneId]: !selectedZones[zoneId],
    };
    setSelectedZones(newSelectedZones);
    if (onChange) {
      onChange(newSelectedZones);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Zonas de Lesión - Haga clic en las áreas afectadas</Label>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Diagrama del cuerpo */}
        <div className="flex-1">
          <div className="relative w-full max-w-md mx-auto bg-slate-50 dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 p-4">
            {/* SVG del cuerpo humano */}
            <svg
              viewBox="0 0 100 130"
              className="w-full h-auto"
              style={{ minHeight: "400px" }}
            >
              {/* Definición de filtro para sombra */}
              <defs>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
                  <feOffset dx="0" dy="1" result="offsetblur"/>
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3"/>
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Cuerpo base (silueta) */}
              <g className="body-outline" stroke="#94a3b8" strokeWidth="0.5" fill="#cbd5e1" opacity="0.3">
                {/* Cabeza */}
                <ellipse cx="50" cy="10" rx="6" ry="8" />
                
                {/* Cuello */}
                <rect x="47" y="18" width="6" height="5" rx="1" />
                
                {/* Hombros */}
                <ellipse cx="38" cy="27" rx="6" ry="4" />
                <ellipse cx="62" cy="27" rx="6" ry="4" />
                
                {/* Tórax */}
                <path d="M 42 28 L 40 40 L 42 50 L 58 50 L 60 40 L 58 28 Z" />
                
                {/* Abdomen */}
                <path d="M 42 50 L 41 58 L 43 64 L 57 64 L 59 58 L 58 50 Z" />
                
                {/* Brazos */}
                <rect x="32" y="30" width="6" height="28" rx="2" />
                <rect x="62" y="30" width="6" height="28" rx="2" />
                
                {/* Antebrazos */}
                <rect x="29" y="58" width="5" height="20" rx="2" />
                <rect x="66" y="58" width="5" height="20" rx="2" />
                
                {/* Manos */}
                <ellipse cx="31" cy="82" rx="3" ry="4" />
                <ellipse cx="69" cy="82" rx="3" ry="4" />
                
                {/* Pelvis */}
                <path d="M 43 64 L 42 70 L 46 72 L 54 72 L 58 70 L 57 64 Z" />
                
                {/* Muslos */}
                <rect x="42" y="72" width="6" height="22" rx="2" />
                <rect x="52" y="72" width="6" height="22" rx="2" />
                
                {/* Rodillas */}
                <ellipse cx="45" cy="95" rx="3.5" ry="3" />
                <ellipse cx="55" cy="95" rx="3.5" ry="3" />
                
                {/* Piernas */}
                <rect x="42" y="98" width="5.5" height="18" rx="2" />
                <rect x="52.5" y="98" width="5.5" height="18" rx="2" />
                
                {/* Pies */}
                <ellipse cx="44.5" cy="120" rx="3.5" ry="2.5" />
                <ellipse cx="55" cy="120" rx="3.5" ry="2.5" />
              </g>

              {/* Zonas interactivas */}
              {bodyZones.map((zone) => (
                <g key={zone.id}>
                  <ellipse
                    cx={zone.x}
                    cy={zone.y + zone.height / 2}
                    rx={zone.width / 2}
                    ry={zone.height / 2}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedZones[zone.id]
                        ? "fill-red-500 opacity-70 stroke-red-700"
                        : "fill-transparent hover:fill-blue-400 hover:opacity-30"
                    }`}
                    strokeWidth="0.5"
                    onClick={() => toggleZone(zone.id)}
                    filter={selectedZones[zone.id] ? "url(#shadow)" : "none"}
                  />
                  {/* Punto central cuando está seleccionado */}
                  {selectedZones[zone.id] && (
                    <circle
                      cx={zone.x}
                      cy={zone.y + zone.height / 2}
                      r="1.5"
                      fill="#dc2626"
                      className="pointer-events-none"
                    />
                  )}
                </g>
              ))}
            </svg>
            
            <p className="text-xs text-center text-muted-foreground mt-2">
              Haga clic en las áreas del cuerpo para marcar zonas de lesión
            </p>
          </div>
        </div>

        {/* Lista de zonas seleccionadas */}
        <div className="flex-1">
          <div className="bg-card border rounded-lg p-4">
            <h4 className="font-medium text-sm mb-3 text-foreground">Zonas Seleccionadas</h4>
            {Object.keys(selectedZones).filter((key) => selectedZones[key]).length > 0 ? (
              <div className="space-y-2">
                {bodyZones
                  .filter((zone) => selectedZones[zone.id])
                  .map((zone) => (
                    <div
                      key={zone.id}
                      className="flex items-center justify-between bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded px-3 py-2"
                    >
                      <span className="text-sm text-red-700 dark:text-red-400 font-medium">
                        {zone.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleZone(zone.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs font-medium"
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No hay zonas seleccionadas. Haga clic en el diagrama para marcar áreas de lesión.
              </p>
            )}
            
            {/* Botón para limpiar todo */}
            {Object.keys(selectedZones).filter((key) => selectedZones[key]).length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedZones({});
                  if (onChange) onChange({});
                }}
                className="mt-4 w-full text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium py-2 border border-red-200 dark:border-red-900 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                Limpiar todas las zonas
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
