export interface FieldConfig {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'datetime-local' | 'email' | 'tel';
  options?: { value: string; label: string }[];
  required?: boolean;
  min?: number;
  max?: number;
  step?: number | string;
  placeholder?: string;
  full?: boolean;
}

export interface ResourceDef {
  name: string;
  singular: string;
  endpoint: string;
  fields: FieldConfig[];
  columns: { key: string; label: string; className?: string; render?: (v: unknown, row: Record<string, unknown>) => React.ReactNode }[];
  titleField?: string;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function readField(obj: Record<string, unknown>, key: string): unknown {
  return obj[key] ?? obj[key.replace(/([A-Z])/g, '_$1').toLowerCase()] ?? obj[altKey(obj, key)];
}

function altKey(obj: Record<string, unknown>, key: string): string {
  const camel = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  if (obj[camel] !== undefined) return camel;
  const snake = key.replace(/([A-Z])/g, '_$1').toLowerCase();
  return obj[snake] !== undefined ? snake : '';
}

export function fmtDate(v: unknown): string {
  if (!v) return '—';
  const d = new Date(String(v));
  if (isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function fmtDateTime(v: unknown): string {
  if (!v) return '—';
  const d = new Date(String(v));
  if (isNaN(d.getTime())) return String(v);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function fmtMoney(v: unknown): string {
  if (v === null || v === undefined || v === '') return '—';
  const n = Number(v);
  if (isNaN(n)) return String(v);
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function fmtNum(v: unknown, decimals = 0): string {
  if (v === null || v === undefined || v === '') return '—';
  const n = Number(v);
  if (isNaN(n)) return String(v);
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
