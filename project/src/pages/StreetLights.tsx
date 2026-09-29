import { useEffect, useState, useCallback } from 'react';
import { Lightbulb, MapPin, Zap, AlertCircle, SlidersHorizontal, Activity, Plus, WifiOff } from 'lucide-react';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import FormField from '@/components/FormField';
import { apiList, apiCreate, apiPutVoid, pickId, isOffline } from '@/lib/api';
import { type FieldConfig, readField, fmtNum } from '@/lib/types';

const lightFields: FieldConfig[] = [
  { key: 'poleNumber', label: 'Pole Number', required: true },
  { key: 'zone', label: 'Zone' },
  { key: 'location', label: 'Location', full: true },
  { key: 'ratedPower', label: 'Rated Power (W)', type: 'number', min: 0 },
  { key: 'dimmingPercentage', label: 'Dimming %', type: 'number', min: 0, max: 100 },
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'DIMMED', label: 'Dimmed' },
    { value: 'OFFLINE', label: 'Offline' },
    { value: 'FAULT', label: 'Fault' },
  ]},
];

export default function StreetLights() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [dimModal, setDimModal] = useState<Record<string, unknown> | null>(null);
  const [dimValue, setDimValue] = useState(100);
  const [dimSaving, setDimSaving] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createData, setCreateData] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setOffline(false);
    try {
      const data = await apiList<Record<string, unknown>>('/api/street-lights');
      setRows(data);
      setError(null);
    } catch (e) {
      if (isOffline(e)) setOffline(true);
      else setError(e instanceof Error ? e.message : 'Failed to load street lights');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDimSave = async () => {
    if (!dimModal) return;
    const id = pickId(dimModal);
    setDimSaving(true);
    try {
      await apiPutVoid(`/api/street-lights/${id}/dimming?percentage=${dimValue}`);
      setDimModal(null);
      load();
    } catch (e) {
      if (isOffline(e)) setOffline(true);
      else setError(e instanceof Error ? e.message : 'Dimming update failed');
    } finally {
      setDimSaving(false);
    }
  };

  const handleCreate = async () => {
    const body: Record<string, unknown> = {};
    for (const f of lightFields) {
      const raw = createData[f.key];
      if (f.type === 'number') body[f.key] = raw === '' ? null : Number(raw);
      else body[f.key] = raw || null;
    }
    try {
      await apiCreate('/api/street-lights', body);
      setCreateOpen(false);
      setCreateData({});
      load();
    } catch (e) {
      if (isOffline(e)) setOffline(true);
      else setError(e instanceof Error ? e.message : 'Create failed');
    }
  };

  const totalLights = rows.length;
  const activeLights = rows.filter((l) => String(readField(l, 'status') || '').toLowerCase().includes('active')).length;
  const avgDimming = totalLights
    ? Math.round(rows.reduce((s, l) => s + Number(readField(l, 'dimmingPercentage') || 100), 0) / totalLights)
    : 0;
  const totalRatedPower = rows.reduce((s, l) => s + Number(readField(l, 'ratedPower') || 0), 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-steel-500/15"><Lightbulb className="w-5 h-5 text-steel-400" /></div>
          <div><p className="text-xs text-slate-500">Total Poles</p><p className="text-xl font-bold text-slate-100">{fmtNum(totalLights)}</p></div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-accent-500/15"><Activity className="w-5 h-5 text-accent-400" /></div>
          <div><p className="text-xs text-slate-500">Active</p><p className="text-xl font-bold text-slate-100">{fmtNum(activeLights)}</p></div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-warn-500/15"><SlidersHorizontal className="w-5 h-5 text-warn-400" /></div>
          <div><p className="text-xs text-slate-500">Avg Dimming</p><p className="text-xl font-bold text-slate-100">{avgDimming}%</p></div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-steel-500/15"><Zap className="w-5 h-5 text-steel-400" /></div>
          <div><p className="text-xs text-slate-500">Rated Power</p><p className="text-xl font-bold text-slate-100">{fmtNum(totalRatedPower)}W</p></div>
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

      <div className="flex justify-end">
        <button className="btn-primary" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" /> Add Street Light
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'poleNumber', label: 'Pole #', render: (v) => <span className="font-mono font-medium text-accent-400">{String(v || '—')}</span> },
          { key: 'zone', label: 'Zone', render: (v) => <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" />{String(v || '—')}</span> },
          { key: 'location', label: 'Location' },
          { key: 'ratedPower', label: 'Rated Power', render: (v) => `${fmtNum(v)} W` },
          { key: 'dimmingPercentage', label: 'Dimming', render: (v) => {
            const pct = Number(v ?? 100);
            const color = pct > 70 ? 'bg-accent-400' : pct > 30 ? 'bg-warn-400' : 'bg-danger-400';
            return (
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-ink-700 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-mono text-slate-300">{pct}%</span>
              </div>
            );
          }},
          { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v || 'unknown')} /> },
        ]}
        rows={rows}
        loading={loading}
        rowKey={(row, i) => String(pickId(row) ?? i)}
        actions={(row) => (
          <button className="btn-secondary text-xs" onClick={() => { setDimModal(row); setDimValue(Number(readField(row, 'dimmingPercentage') ?? 100)); }}>
            <SlidersHorizontal className="w-3.5 h-3.5" /> Set Dimming
          </button>
        )}
      />

      <Modal
        open={!!dimModal}
        title={`Dimming Control — Pole ${readField(dimModal || {}, 'poleNumber') || ''}`}
        onClose={() => setDimModal(null)}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setDimModal(null)}>Cancel</button>
            <button className="btn-primary" onClick={handleDimSave} disabled={dimSaving}>
              {dimSaving ? 'Applying…' : 'Apply'}
            </button>
          </>
        }
      >
        <div className="space-y-6 py-2">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-8 border-ink-700 flex items-center justify-center"
                style={{ boxShadow: dimValue > 0 ? `0 0 ${dimValue / 3}px rgba(17,224,195,${dimValue / 200})` : 'none' }}>
                <span className="text-3xl font-bold text-accent-400">{dimValue}%</span>
              </div>
            </div>
          </div>
          <div>
            <label className="label">Dimming Percentage</label>
            <input
              type="range" min={0} max={100} value={dimValue}
              onChange={(e) => setDimValue(Number(e.target.value))}
              className="w-full h-2 bg-ink-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0% (Off)</span><span>50%</span><span>100% (Full)</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[0, 25, 50, 75, 100].map((p) => (
              <button key={p} className={`btn-secondary text-xs ${dimValue === p ? 'ring-2 ring-accent-500' : ''}`} onClick={() => setDimValue(p)}>{p}%</button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal
        open={createOpen}
        title="Add Street Light"
        onClose={() => setCreateOpen(false)}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setCreateOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleCreate}>Create</button>
          </>
        }
      >
        <div className="grid md:grid-cols-2 gap-4">
          {lightFields.map((f) => (
            <FormField
              key={f.key}
              field={f}
              value={createData[f.key] ?? ''}
              onChange={(key, val) => setCreateData((prev) => ({ ...prev, [key]: val }))}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}
