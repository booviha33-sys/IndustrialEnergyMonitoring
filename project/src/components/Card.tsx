import { type ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  trend?: string;
  trendUp?: boolean;
  accent?: 'accent' | 'warn' | 'danger' | 'steel';
}

const accentMap = {
  accent: 'from-accent-500/20 to-accent-500/5 text-accent-400 border-accent-500/20',
  warn: 'from-warn-500/20 to-warn-500/5 text-warn-400 border-warn-500/20',
  danger: 'from-danger-500/20 to-danger-500/5 text-danger-400 border-danger-500/20',
  steel: 'from-steel-500/20 to-steel-500/5 text-steel-400 border-steel-500/20',
};

export default function StatCard({ label, value, unit, icon, trend, trendUp, accent = 'steel' }: StatCardProps) {
  return (
    <div className="card p-5 relative overflow-hidden group hover:border-ink-600 transition-all">
      <div className={`absolute inset-0 bg-gradient-to-br ${accentMap[accent]} opacity-50 pointer-events-none`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-100">
            {value}
            {unit && <span className="ml-1 text-sm font-normal text-slate-400">{unit}</span>}
          </p>
          {trend && (
            <p className={`mt-1 text-xs ${trendUp ? 'text-accent-400' : 'text-slate-400'}`}>{trend}</p>
          )}
        </div>
        {icon && (
          <div className={`p-2 rounded-lg bg-ink-900/80 ${accentMap[accent].split(' ').pop()}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
