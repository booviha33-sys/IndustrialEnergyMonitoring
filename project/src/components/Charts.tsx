import { useMemo } from 'react';

interface ChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  unit?: string;
  format?: (n: number) => string;
}

export function LineChart({ data, height = 200, color = '#11e0c3', unit, format }: ChartProps) {
  const { points, areaPath, linePath, max, min, labels } = useMemo(() => {
    if (!data.length) return { points: [], areaPath: '', linePath: '', max: 0, min: 0, labels: [] };
    const w = 1000;
    const h = height;
    const pad = 8;
    const vals = data.map((d) => d.value);
    const max = Math.max(...vals, 0);
    const min = Math.min(...vals, 0);
    const range = max - min || 1;
    const stepX = (w - pad * 2) / Math.max(data.length - 1, 1);
    const pts = data.map((d, i) => {
      const x = pad + i * stepX;
      const y = h - pad - ((d.value - min) / range) * (h - pad * 2);
      return { x, y, label: d.label, value: d.value };
    });
    const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const areaPath = `${linePath} L ${pts[pts.length - 1].x.toFixed(1)} ${h - pad} L ${pts[0].x.toFixed(1)} ${h - pad} Z`;
    const labelStep = Math.ceil(data.length / 8);
    const labels = data.map((d, i) => (i % labelStep === 0 ? d.label : '')).filter(Boolean);
    return { points: pts, areaPath, linePath, max, min, labels };
  }, [data, height]);

  if (!data.length) return <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm">No data available</div>;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 1000 ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((r) => (
          <line key={r} x1="8" x2="992" y1={height * r} y2={height * r} stroke="#1b2937" strokeWidth="1" strokeDasharray="4 4" />
        ))}
        <path d={areaPath} fill="url(#lineGrad)" />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} className="opacity-0 hover:opacity-100" />
        ))}
      </svg>
      <div className="flex justify-between mt-2 text-[10px] text-slate-500 px-1">
        {labels.map((l, i) => <span key={i}>{l}</span>)}
      </div>
      {unit && (
        <div className="flex justify-between mt-1 text-xs text-slate-400">
          <span>Min: {format ? format(min) : min}{unit}</span>
          <span>Max: {format ? format(max) : max}{unit}</span>
        </div>
      )}
    </div>
  );
}

export function BarChart({ data, height = 200, color = '#3ef5da', format }: ChartProps) {
  const { bars, max } = useMemo(() => {
    if (!data.length) return { bars: [], max: 0 };
    const max = Math.max(...data.map((d) => d.value), 0) || 1;
    const bars = data.map((d) => ({ ...d, pct: (d.value / max) * 100 }));
    return { bars, max };
  }, [data]);

  if (!data.length) return <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm">No data available</div>;

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end gap-1 h-full pb-6 relative">
        {bars.map((b, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end group h-full min-w-0">
            <div className="text-[10px] text-slate-300 mb-1 opacity-0 group-hover:opacity-100 transition truncate w-full text-center">
              {format ? format(b.value) : b.value}
            </div>
            <div
              className="w-full rounded-t transition-all duration-300 group-hover:brightness-125"
              style={{ height: `${Math.max(b.pct, 2)}%`, background: `linear-gradient(to top, ${color}33, ${color})` }}
            />
            <div className="text-[9px] text-slate-500 mt-1 truncate w-full text-center">{b.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DonutProps {
  segments: { label: string; value: number; color: string }[];
  size?: number;
}

export function DonutChart({ segments, size = 180 }: DonutProps) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 40;
  const cx = 50;
  const cy = 50;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className="-rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1b2937" strokeWidth="10" />
        {segments.map((seg, i) => {
          const len = (seg.value / total) * circ;
          const el = (
            <circle
              key={i}
              cx={cx} cy={cy} r={r} fill="none"
              stroke={seg.color} strokeWidth="10"
              strokeDasharray={`${len} ${circ - len}`}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="space-y-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-sm" style={{ background: seg.color }} />
            <span className="text-slate-300">{seg.label}</span>
            <span className="text-slate-500 ml-auto">{Math.round((seg.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
