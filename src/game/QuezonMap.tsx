import { districts, District, MAP_H, MAP_W, project } from "./data";

type Pt = { x: number; y: number };
const hull = (pts: Pt[]): Pt[] => {
  const s = [...pts].sort((a, b) => a.x - b.x || a.y - b.y);
  if (s.length < 3) return s;
  const cross = (o: Pt, a: Pt, b: Pt) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const p of s) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of [...s].reverse()) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};

const bbox = (d: District) => {
  const ps = d.localities.map((l) => project(l.lat, l.lng));
  const xs = ps.map((p) => p.x), ys = ps.map((p) => p.y);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
};

export const QuezonMap = ({
  selected, completed, onDistrict, onLocality,
}: {
  selected: District | null;
  completed: Record<string, number>;
  onDistrict: (d: District) => void;
  onLocality: (name: string) => void;
}) => {
  let transform = "translate(0px,0px) scale(1)";
  if (selected) {
    const b = bbox(selected);
    const pad = 50;
    const w = b.maxX - b.minX + pad * 2, h = b.maxY - b.minY + pad * 2;
    const k = Math.min(MAP_W / w, MAP_H / h, 4);
    const cx = (b.minX + b.maxX) / 2, cy = (b.minY + b.maxY) / 2;
    transform = `translate(${MAP_W / 2 - cx * k}px,${MAP_H / 2 - cy * k}px) scale(${k})`;
  }
  const k = selected ? parseFloat(transform.split("scale(")[1]) : 1;

  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="w-full h-full touch-manipulation" role="img" aria-label="Map of Quezon Province">
      <defs>
        <pattern id="waves" width="24" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 6 Q6 0 12 6 T24 6" fill="none" stroke="hsl(var(--ocean) / 0.18)" strokeWidth="1.2" />
        </pattern>
      </defs>
      <rect width={MAP_W} height={MAP_H} fill="url(#waves)" />
      <g style={{ transform, transformOrigin: "0 0", transition: "transform 0.8s cubic-bezier(0.4,0,0.2,1)" }}>
        {districts.map((d) => {
          const pts = hull(d.localities.map((l) => project(l.lat, l.lng)));
          const path = pts.map((p) => `${p.x},${p.y}`).join(" ");
          const dim = selected && selected.id !== d.id;
          const b = bbox(d);
          return (
            <g key={d.id} onClick={() => !selected && onDistrict(d)}
              className={selected ? "" : "cursor-pointer game-district"}
              style={{ opacity: dim ? 0.25 : 1, transition: "opacity 0.6s" }}>
              <polygon points={path} fill={`hsl(${d.color})`} stroke={`hsl(${d.color})`}
                strokeWidth={34} strokeLinejoin="round" opacity={0.85} />
              {d.localities.map((l) => {
                const p = project(l.lat, l.lng);
                return <circle key={l.name} cx={p.x} cy={p.y} r={16} fill={`hsl(${d.color})`} />;
              })}
              {!selected && (
                <text x={(b.minX + b.maxX) / 2} y={(b.minY + b.maxY) / 2} textAnchor="middle" dominantBaseline="middle"
                  className="font-display" fontSize={18} fontWeight={700} fill="hsl(var(--card))"
                  style={{ paintOrder: "stroke", stroke: "hsl(var(--foreground) / 0.5)", strokeWidth: 3 }}>
                  {d.name}
                </text>
              )}
            </g>
          );
        })}
        {selected && selected.localities.map((l, i) => {
          const p = project(l.lat, l.lng);
          const done = (completed[l.name] || 0) > 0;
          return (
            <g key={l.name} onClick={() => onLocality(l.name)} className="cursor-pointer game-marker"
              style={{ animationDelay: `${0.5 + i * 0.05}s` }}>
              <circle cx={p.x} cy={p.y} r={7 / k} fill={done ? "hsl(var(--saffron))" : "hsl(var(--card))"}
                stroke="hsl(var(--foreground))" strokeWidth={1.5 / k} />
              <circle cx={p.x} cy={p.y} r={18 / k} fill="transparent" />
              <text x={p.x} y={p.y - 11 / k} textAnchor="middle" fontSize={11 / k} fontWeight={700}
                fill="hsl(var(--foreground))" style={{ paintOrder: "stroke", stroke: "hsl(var(--card))", strokeWidth: 3 / k }}>
                {l.name}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};
