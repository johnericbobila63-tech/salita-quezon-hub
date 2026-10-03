import { districts, District } from "./data";
import { MAP_H, MAP_W, shapes } from "./shapes";

const boxCache: Record<string, { minX: number; maxX: number; minY: number; maxY: number }> = {};
const shapeBox = (name: string) => {
  if (boxCache[name]) return boxCache[name];
  const nums = (shapes[name]?.d.match(/-?\d+(\.\d+)?/g) || []).map(Number);
  const xs = nums.filter((_, i) => i % 2 === 0), ys = nums.filter((_, i) => i % 2 === 1);
  return (boxCache[name] = { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) });
};
const districtBox = (d: District) => {
  const bs = d.localities.map((l) => shapeBox(l.name));
  return {
    minX: Math.min(...bs.map((b) => b.minX)), maxX: Math.max(...bs.map((b) => b.maxX)),
    minY: Math.min(...bs.map((b) => b.minY)), maxY: Math.max(...bs.map((b) => b.maxY)),
  };
};

export const QuezonMap = ({
  selected, selectedLocality = "", completed, onDistrict, onLocality,
}: {
  selected: District | null;
  selectedLocality?: string;
  completed: Record<string, number>;
  onDistrict: (d: District) => void;
  onLocality: (name: string) => void;
}) => {
  let k = 1, tx = 0, ty = 0;
  if (selected) {
    const b = districtBox(selected);
    const pad = 20;
    k = Math.min(MAP_W / (b.maxX - b.minX + pad * 2), MAP_H / (b.maxY - b.minY + pad * 2), 5);
    tx = MAP_W / 2 - ((b.minX + b.maxX) / 2) * k;
    ty = MAP_H / 2 - ((b.minY + b.maxY) / 2) * k;
  }

  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="w-full h-full touch-manipulation" role="img" aria-label="Map of Quezon Province">
      <defs>
        <pattern id="waves" width="24" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 6 Q6 0 12 6 T24 6" fill="none" stroke="hsl(var(--ocean) / 0.18)" strokeWidth="1.2" />
        </pattern>
      </defs>
      <rect width={MAP_W} height={MAP_H} fill="url(#waves)" />
      <g style={{ transform: `translate(${tx}px,${ty}px) scale(${k})`, transformOrigin: "0 0", transition: "transform 0.8s cubic-bezier(0.4,0,0.2,1)" }}>
        {districts.map((d) => {
          const dim = selected && selected.id !== d.id;
          const active = selected?.id === d.id;
          return (
            <g key={d.id} onClick={() => !selected && onDistrict(d)}
              className={selected ? "" : "cursor-pointer game-district"}
              role={!selected ? "button" : undefined}
              tabIndex={!selected ? 0 : undefined}
              aria-label={!selected ? `Piliin ang ${d.name}` : undefined}
              onKeyDown={(event) => {
                if (!selected && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  onDistrict(d);
                }
              }}
              style={{ opacity: dim ? 0.2 : 1, transition: "opacity 0.6s" }}>
              <title>{d.name}</title>
              {d.localities.map((l) => {
                const shape = shapes[l.name];
                if (!shape) return null;
                const localitySelected = active && selectedLocality === l.name;
                return (
                  <path key={l.name} d={shape.d} fillRule="evenodd"
                    fill={active && (completed[l.name] || 0) > 0 ? "hsl(var(--saffron))" : `hsl(${d.color})`}
                    stroke={localitySelected ? "hsl(var(--foreground))" : active ? "hsl(var(--card))" : `hsl(${d.color})`}
                    strokeWidth={localitySelected ? 3 / k : active ? 1.2 / k : 0.6}
                    className={active ? "cursor-pointer game-town focus:outline-none" : ""}
                    role={active ? "button" : undefined}
                    tabIndex={active ? 0 : undefined}
                    aria-label={active ? `Tingnan ang mga salita sa ${l.name}` : undefined}
                    aria-pressed={active ? localitySelected : undefined}
                    onKeyDown={(event) => {
                      if (active && (event.key === "Enter" || event.key === " ")) {
                        event.preventDefault();
                        onLocality(l.name);
                      }
                    }}
                    onClick={(e) => { if (active) { e.stopPropagation(); onLocality(l.name); } }}>
                    <title>{l.name}</title>
                  </path>
                );
              })}
            </g>
          );
        })}
        {!selected && districts.map((d) => {
          const b = districtBox(d);
          const pos = ({ 1: [0.45, 0.45], 2: [0.35, 0.6], 3: [0.55, 0.45], 4: [0.5, 0.45] } as Record<number, [number, number]>)[d.id] ?? [0.5, 0.5];
          return (
            <g key={d.id} className="pointer-events-none">
              <text x={b.minX + (b.maxX - b.minX) * pos[0]} y={b.minY + (b.maxY - b.minY) * pos[1]} textAnchor="middle"
                fontSize={16} fontWeight={800} fill="hsl(var(--card))"
                style={{ paintOrder: "stroke", stroke: "hsl(var(--foreground) / 0.6)", strokeWidth: 3 }}>
                {d.name}
              </text>
            </g>
          );
        })}
        {selected && selected.localities.map((l, i) => {
          const s = shapes[l.name];
          if (!s) return null;
          return (
            <text key={l.name} x={s.cx} y={s.cy} textAnchor="middle" dominantBaseline="middle"
              fontSize={9 / k} fontWeight={700} fill="hsl(var(--foreground))" className="game-marker pointer-events-none"
              onClick={() => onLocality(l.name)}
              style={{ animationDelay: `${0.5 + i * 0.04}s`, cursor: "pointer", paintOrder: "stroke", stroke: "hsl(var(--card))", strokeWidth: 2.5 / k }}>
              {l.name.toUpperCase()}
            </text>
          );
        })}
      </g>
    </svg>
  );
};
