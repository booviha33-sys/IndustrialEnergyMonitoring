import { useEffect, useState, useCallback } from 'react';
import { Zap, Gauge, Sun, Activity, AlertCircle, Filter, WifiOff } from 'lucide-react';
import DataTable from '@/components/DataTable';
import { LineChart, BarChart } from '@/components/Charts';
import { apiList, isOffline } from '@/lib/api';
import { readField, fmtNum, fmtDateTime } from '@/lib/types';

export default function Telemetry() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [filterLight, setFilterLight] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setOffline(false);
    try {
      const data = await apiList<Record<string, unknown>>('/api/telemetry');
      setRows(data);
      setError(null);
    } catch (e) {
      if (isOffline(e)) setOffline(true);
      else setError(e instanceof Error ? e.message : 'Failed to load telemetry');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = filterLight
    ? rows.filter((r) => String(readField(r, 'streetLightId') || readField(r, 'lightId') || '') === filterLight)
    : rows;

  const sorted = [...filtered].sort((a, b) => {
    const ta = new Date(String(readField(a, 'timestamp'))).getTime() || 0;
    const tb = new Date(String(readField(b, 'timestamp'))).getTime() || 0;
    return ta - tb;
  });

  const energySeries = sorted
    .map((t) => ({ label: tsLabel(readField(t, 'timestamp')), value: Number(readField(t, 'energyKwh') || readField(t, 'energy') || 0) }))
    .slice(-30);
  const powerSeries = sorted
    .map((t) => ({ label: tsLabel(readField(t, 'timestamp')), value: Number(readField(t, 'power') || 0) }))
    .slice(-30);

  const lightIds = [...new Set(rows.map((r) => String(readField(r, 'streetLightId') || readField(r, 'lightId') || '')))].filter(Boolean);

  const avgVoltage = filtered.length ? filtered.reduce((s, t) => s + Number(readField(t, 'voltage') || 0), 0) / filtered.length : 0;
  const avgCurrent = filtered.length ? filtered.reduce((s, t) => s + Number(readField(t, 'current') || 0), 0) / filtered.length : 0;
  const avgPower = filtered.length ? filtered.reduce((s, t) => s + Number(readField(t, 'power') || 0), 0) / filtered.length : 0;
  const avgAmbient = filtered.length ? filtered.reduce((s, t) => s + Number(readField(t, 'ambientLight') || readField(t, 'ambient') || 0), 0) / filtered.length : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-steel-500/15"><Zap className="w-5 h-5 text-steel-400" /></div>
          <div><p className="text-xs text-slate-500">Avg Voltage</p><p className="text-xl font-bold text-slate-100">{fmtNum(avgVoltage, 1)}<span className="text-sm text-slate-500 ml-1">V</span></p></div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-accent-500/15"><Activity className="w-5 h-5 text-accent-400" /></div>
          <div><p className="text-xs text-slate-500">Avg Current</p><p className="text-xl font-bold text-slate-100">{fmtNum(avgCurrent, 2)}<span className="text-sm text-slate-500 ml-1">A</span></p></div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-warn-500/15"><Gauge className="w-5 h-5 text-warn-400" /></div>
          <div><p className="text-xs text-slate-500">Avg Power</p><p className="text-xl font-bold text-slate-100">{fmtNum(avgPower, 1)}<span className="text-sm text-slate-500 ml-1">W</span></p></div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-steel-500/15"><Sun className="w-5 h-5 text-steel-400" /></div>
          <div><p className="text-xs text-slate-500">Avg Ambient</p><p className="text-xl font-bold text-slate-100">{fmtNum(avgAmbient, 0)}<span className="text-sm text-slate-500 ml-1">lx</span></p></div>
        </div>
      </div>

      {offline && (
        <div className="card p-4 border-warn-500/30 bg-warn-500/5 flex items-start gap-3">
          <WifiOff className="w-5 h-5 text-warn-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-warn-300">Backend Offline</p>
            <p className="text-xs text-slate-400 mt-1">Cannot reach the Spring Boot API at localhost:8080. Start the backend to load live data.</p>
          </div>
        </div>
      )}

      {error && !offline && (
        <div className="card p-4 border-danger-500/30 bg-danger-500/5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-danger-400 flex-shrink-0 mt-0.5" />
          <div><p className="text-sm font-medium text-danger-300">Error</p><p className="text-xs text-slate-400 mt-1">{error}</p></div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold text-slate-100 mb-1">Energy Consumption (kWh)</h3>
          <p className="text-xs text-slate-500 mb-4">Trend over recent readings</p>
          <LineChart data={energySeries} color="#ffa81f" unit=" kWh" format={(n) => fmtNum(n, 1)} height={200} />
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-slate-100 mb-1">Power Consumption (W)</h3>
          <p className="text-xs text-slate-500 mb-4">Real-time power readings</p>
          <BarChart data={powerSeries} color="#11e0c3" format={(n) => fmtNum(n, 0)} height={200} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-slate-500" />
        <select className="input max-w-xs" value={filterLight} onChange={(e) => setFilterLight(e.target.value)}>
          <option value="">All street lights</option>
          {lightIds.map((id) => <option key={id} value={id}>Light #{id}</option>)}
        </select>
        <span className="text-sm text-slate-500">{filtered.length} readings</span>
      </div>

      <DataTable
        columns={[
          { key: 'streetLightId', label: 'Light ID', render: (v) => <span className="font-mono text-accent-400">{String(v || '—')}</span> },
          { key: 'voltage', label: 'Voltage', render: (v) => `${fmtNum(v, 1)} V` },
          { key: 'current', label: 'Current', render: (v) => `${fmtNum(v, 2)} A` },
          { key: 'power', label: 'Power', render: (v) => `${fmtNum(v, 1)} W` },
          { key: 'energyKwh', label: 'Energy', render: (v) => `${fmtNum(v || readField({}, ''), 2)} kWh` },
          { key: 'ambientLight', label: 'Ambient', render: (v) => `${fmtNum(v, 0)} lx` },
          { key: 'timestamp', label: 'Timestamp', render: (v) => fmtDateTime(v) },
        ]}
        rows={sorted.slice().reverse()}
        loading={loading}
        rowKey={(row, i) => `${readField(row, 'id') ?? i}`}
      />
    </div>
  );
}

function tsLabel(v: unknown): string {
  if (!v) return '';
  const d = new Date(String(v));
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
