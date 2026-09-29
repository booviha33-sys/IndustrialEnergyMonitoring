interface BadgeProps {
  status?: string | null;
  variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'info';
}

const variantClasses: Record<string, string> = {
  success: 'bg-accent-500/15 text-accent-400 border border-accent-500/20',
  warning: 'bg-warn-500/15 text-warn-400 border border-warn-500/20',
  danger: 'bg-danger-500/15 text-danger-400 border border-danger-500/20',
  neutral: 'bg-ink-700 text-slate-300 border border-ink-600',
  info: 'bg-steel-500/15 text-steel-300 border border-steel-500/20',
};

const successWords = ['active', 'online', 'on', 'paid', 'completed', 'closed', 'resolved', 'approved', 'open'];
const warningWords = ['pending', 'review', 'dimmed', 'warning', 'partial', 'processing', 'awaiting', 'low'];
const dangerWords = ['fault', 'offline', 'error', 'overdue', 'critical', 'rejected', 'failed', 'down', 'outage'];
const infoWords = ['draft', 'scheduled', 'info', 'maintenance'];

function inferVariant(status: string): keyof typeof variantClasses {
  const lower = status.toLowerCase();
  if (successWords.some((w) => lower.includes(w))) return 'success';
  if (warningWords.some((w) => lower.includes(w))) return 'warning';
  if (dangerWords.some((w) => lower.includes(w))) return 'danger';
  if (infoWords.some((w) => lower.includes(w))) return 'info';
  return 'neutral';
}

export default function StatusBadge({ status, variant }: BadgeProps) {
  const v = variant || (status ? inferVariant(status) : 'neutral');
  const label = status || 'Unknown';
  const dotColor: Record<string, string> = {
    success: 'bg-accent-400',
    warning: 'bg-warn-400',
    danger: 'bg-danger-400',
    neutral: 'bg-slate-400',
    info: 'bg-steel-400',
  };

  return (
    <span className={`badge ${variantClasses[v]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor[v]} ${v === 'success' || v === 'warning' || v === 'danger' ? 'animate-pulse-slow' : ''}`} />
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </span>
  );
}
