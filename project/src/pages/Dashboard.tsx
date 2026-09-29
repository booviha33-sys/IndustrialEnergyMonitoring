import { useEffect, useState, useCallback } from 'react';
import { Lightbulb, Zap, Wrench, Wallet, TrendingDown, TrendingUp, Gauge, Activity, WifiOff } from 'lucide-react';
import StatCard from '@/components/Card';
import { LineChart, BarChart, DonutChart } from '@/components/Charts';
import { apiList, apiFetch, isOffline } from '@/lib/api';
import { readField, fmtNum, fmtMoney } from '@/lib/types';

interface DashData {
  lights: Record<string, unknown>[];
  telemetry: Record<string, unknown>[];
  maintenance: Record<string, unknown>[];
  powerSummary: Record<string, unknown> | null;
  budgetReport: Record<string, unknown> | null;
}

export default function Dashboard() {
  const [data, setData] = useState<DashData>({
    lights: [], telemetry: [], maintenance: [], powerSummary: null, budgetReport: null,
  });
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setOffline(false);
    try {
      const [lights, telemetry, maintenance, powerSummary, budgetReport] = await Promise.all([
        apiList<Record<string, unknown>>('/api/street-lights').catch(() => []),
        apiList<Record<string, unknown>>('/api/telemetry').catch(() => []),
        apiList<Record<string, unknown>>('/api/maintenance-tickets').catch(() => []),
        apiFetch<Record<string, unknown>>('/api/street-lights/power-summary').catch(() => null),
        apiFetch<Record<string, unknown>>('/api/reports/budget').catch(() => null),
      ]);

      const anyOffline = [lights, telemetry, maintenance].every((arr) => arr.length === 0) && !powerSummary && !budgetReport;
      if (anyOffline) {
        try {
          await apiFetch('/api/street-lights');
        } catch (e) {
          if (isOffline(e)) setOffline(true);
        }
      }

      setData({ lights, telemetry, maintenance, powerSummary, budgetReport });
    } catch {
      setOffline(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalLights = data.lights.length;
  const activeLights = data.lights.filter((l) => String(readField(l, 'status') || '').toLowerCase().includes('active')).length;

  const ps = data.powerSummary;
  const totalEnergy = Number(readField(ps || {}, 'totalEnergy') ?? readField(ps || {}, 'totalEnergyKwh') ?? 0) ||
    data.telemetry.reduce((s, t) => s + Number(readField(t, 'energyKwh') || readField(t, 'energy') || 0), 0);
  const avgPower = Number(readField(ps || {}, 'averagePower') ?? readField(ps || {}, 'avgPower') ?? 0) ||
    (data.telemetry.length ? data.telemetry.reduce((s, t) => s + Number(readField(t, 'power') || 0), 0) / data.telemetry.length : 0);

  const openTickets = data.maintenance.filter((t) => {
    const s = String(readField(t, 'status') || '').toLowerCase();
    return s.includes('open') || s.includes('progress');
  }).length;

  const br = data.budgetReport;
  const totalBudget = Number(readField(br || {}, 'totalPlanned') ?? readField(br || {}, 'plannedBudget') ?? readField(br || {}, 'totalBudget') ?? 0);
  const actualExpenses = Number(readField(br || {}, 'totalActual') ?? readField(br || {}, 'actualExpenses') ?? readField(br || {}, 'totalActualExpenses') ?? 0);
  const variance = Number(readField(br || {}, 'variance') ?? (totalBudget - actualExpenses));

  const energySeries = data.telemetry
    .map((t) => ({ label: tsLabel(readField(t, 'timestamp')), value: Number(readField(t, 'energyKwh') || readField(t, 'energy') || 0) }))
    .slice(-24);
  const powerSeries = data.telemetry
    .map((t) => ({ label: tsLabel(readField(t, 'timestamp')), value: Number(readField(t, 'power') || 0) }))
    .slice(-24);

  const zoneData = (() => {
    const map = new Map<string, number>();
    data.lights.forEach((l) => {
      const z = String(readField(l, 'zone') || 'Unknown');
      map.set(z, (map.get(z) || 0) + 1);
    });
    const colors = ['#11e0c3', '#3d6286', '#ffa81f', '#c93550', '#5d83a3', '#3ef5da'];
    return [...map.entries()].map(([label, value], i) => ({ label, value, color: colors[i % colors.length] }));
  })();

  const statusCounts = (() => {
    const active = data.lights.filter((l) => String(readField(l, 'status') || '').toLowerCase().includes('active')).length;
    const offline = data.lights.filter((l) => String(readField(l, 'status') || '').toLowerCase().includes('off')).length;
    const dimmed = data.lights.filter((l) => String(readField(l, 'status') || '').toLowerCase().includes('dim')).length;
    const fault = data.lights.filter((l) => String(readField(l, 'status') || '').toLowerCase().includes('fault')).length;
    const other = totalLights - active - offline - dimmed - fault;
    return [
      { label: 'Active', value: active, color: '#11e0c3' },
      { label: 'Dimmed', value: dimmed, color: '#ffa81f' },
      { label: 'Offline', value: offline, color: '#c93550' },
      { label: 'Fault', value: fault, color: '#e3566f' },
      { label: 'Other', value: Math.max(other, 0), color: '#475a72' },
    ].filter((s) => s.value > 0);
  })();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {offline && (
        <div className="card p-4 border-warn-500/30 bg-warn-500/5 flex items-start gap-3">
          <WifiOff className="w-5 h-5 text-warn-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-warn-300">Backend Offline</p>
            <p className="text-xs text-slate-400 mt-1">
              Cannot reach the Spring Boot API at localhost:8080. Start the backend server to load live data.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Street Lights" value={fmtNum(totalLights)} icon={<Lightbulb className="w-5 h-5" />} accent="steel" />
        <StatCard label="Active Lights" value={fmtNum(activeLights)} icon={<Activity className="w-5 h-5" />} accent="accent"
          trend={`${totalLights ? Math.round((activeLights / totalLights) * 100) : 0}% operational`} trendUp />
        <StatCard label="Total Energy" value={fmtNum(totalEnergy, 1)} unit="kWh" icon={<Zap className="w-5 h-5" />} accent="warn" />
        <StatCard label="Avg Power" value={fmtNum(avgPower, 1)} unit="W" icon={<Gauge className="w-5 h-5" />} accent="steel" />
        <StatCard label="Open Tickets" value={fmtNum(openTickets)} icon={<Wrench className="w-5 h-5" />} accent="danger"
          trend={openTickets > 0 ? 'Requires attention' : 'All clear'} trendUp={openTickets === 0} />
        <StatCard label="Planned Budget" value={fmtMoney(totalBudget)} icon={<Wallet className="w-5 h-5" />} accent="steel" />
        <StatCard label="Actual Expenses" value={fmtMoney(actualExpenses)} icon={<TrendingDown className="w-5 h-5" />} accent="warn" />
        <StatCard label="Budget Variance" value={fmtMoney(variance)} icon={<TrendingUp className="w-5 h-5" />}
          accent={variance >= 0 ? 'accent' : 'danger'} trend={variance >= 0 ? 'Under budget' : 'Over budget'} trendUp={variance >= 0} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-100">Energy Consumption</h3>
              <p className="text-xs text-slate-500">Last 24 telemetry readings (kWh)</p>
            </div>
            <Zap className="w-5 h-5 text-warn-400" />
          </div>
          <LineChart data={energySeries} color="#ffa81f" unit=" kWh" format={(n) => fmtNum(n, 1)} height={220} />
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-100">Light Status</h3>
          </div>
          {statusCounts.length > 0 ? (
            <DonutChart segments={statusCounts} size={160} />
          ) : (
            <div className="h-[160px] flex items-center justify-center text-slate-500 text-sm">No data</div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-100">Power Consumption</h3>
              <p className="text-xs text-slate-500">Real-time power readings (W)</p>
            </div>
            <Gauge className="w-5 h-5 text-accent-400" />
          </div>
          <BarChart data={powerSeries} color="#11e0c3" format={(n) => fmtNum(n, 0)} height={220} />
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-100">Lights by Zone</h3>
          </div>
          {zoneData.length > 0 ? (
            <div className="space-y-3 mt-2">
              {zoneData.map((z) => (
                <div key={z.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{z.label}</span>
                    <span className="text-slate-500">{z.value}</span>
                  </div>
                  <div className="h-2 bg-ink-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(z.value / Math.max(...zoneData.map((x) => x.value))) * 100}%`, background: z.color }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[160px] flex items-center justify-center text-slate-500 text-sm">No data</div>
          )}
        </div>
      </div>
    </div>
  );
}

function tsLabel(v: unknown): string {
  if (!v) return '';
  const d = new Date(String(v));
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
