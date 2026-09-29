import { useState, useEffect, useCallback } from 'react';
import {
  FileBarChart,
  TrendingUp,
  Wallet,
  Zap,
  AlertCircle,
  Download,
  WifiOff,
} from 'lucide-react';

import { BarChart } from '@/components/Charts';
import { apiFetch, isOffline } from '@/lib/api';
import { readField, fmtMoney, fmtNum } from '@/lib/types';

type ReportKey =
  | 'balance-sheet'
  | 'profit-loss'
  | 'budget'
  | 'power-summary';

const reportTabs: {
  key: ReportKey;
  label: string;
  endpoint: string;
  icon: typeof FileBarChart;
}[] = [
  {
    key: 'balance-sheet',
    label: 'Balance Sheet',
    endpoint: '/api/reports/balance-sheet',
    icon: FileBarChart,
  },
  {
    key: 'profit-loss',
    label: 'Profit & Loss',
    endpoint: '/api/reports/profit-loss',
    icon: TrendingUp,
  },
  {
    key: 'budget',
    label: 'Budget Report',
    endpoint: '/api/reports/budget',
    icon: Wallet,
  },
  {
    key: 'power-summary',
    label: 'Power Summary',
    endpoint: '/api/street-lights/power-summary',
    icon: Zap,
  },
];

export default function Reports() {
  const [active, setActive] =
    useState<ReportKey>('balance-sheet');

  const [data, setData] =
    useState<Record<string, unknown> | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const load = useCallback(async () => {
    const rpt =
      reportTabs.find((r) => r.key === active)!;

    setLoading(true);
    setError(null);

    try {
      const result =
        await apiFetch<Record<string, unknown>>(
          rpt.endpoint
        );

      setData(result);
      setError(null);

    } catch (e) {

      if (isOffline(e)) {
        setError(
          'Backend Offline — cannot reach localhost:8080'
        );
      } else {
        setError(
          e instanceof Error
            ? e.message
            : 'Failed to load report'
        );
      }

      setData(null);

    } finally {
      setLoading(false);
    }

  }, [active]);

  useEffect(() => {
    load();
  }, [load]);

  const current =
    reportTabs.find((r) => r.key === active)!;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Report Tabs */}
      <div className="card p-1.5">
        <div className="flex gap-1 overflow-x-auto">

          {reportTabs.map((tab) => {

            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`tab-btn flex items-center gap-2 ${
                  active === tab.key
                    ? 'tab-active'
                    : 'tab-inactive'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );

          })}

        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">

        <h3 className="text-lg font-semibold text-slate-100">
          {current.label}
        </h3>

        <button
          className="btn-secondary text-xs"
          onClick={() => window.print()}
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>

      </div>

      {/* Error */}
      {error && (
        <div
          className={`card p-4 flex items-start gap-3 ${
            error.startsWith('Backend Offline')
              ? 'border-warn-500/30 bg-warn-500/5'
              : 'border-danger-500/30 bg-danger-500/5'
          }`}
        >

          {error.startsWith('Backend Offline') ? (
            <WifiOff className="w-5 h-5 text-warn-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-danger-400 flex-shrink-0 mt-0.5" />
          )}

          <div>

            <p
              className={`text-sm font-medium ${
                error.startsWith('Backend Offline')
                  ? 'text-warn-300'
                  : 'text-danger-300'
              }`}
            >
              {error.startsWith('Backend Offline')
                ? 'Backend Offline'
                : 'Error'}
            </p>

            <p className="text-xs text-slate-400 mt-1">
              {error}
            </p>

          </div>

        </div>
      )}

      {/* Loading / Report */}
      {loading ? (

        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
        </div>

      ) : data ? (

        <ReportView
          kind={active}
          data={data}
        />

      ) : null}

    </div>
  );
}


// ============================================================
// REPORT VIEW
// ============================================================

function ReportView({
  kind,
  data,
}: {
  kind: ReportKey;
  data: Record<string, unknown>;
}) {

  if (kind === 'power-summary') {
    return <PowerSummary data={data} />;
  }

  if (kind === 'budget') {
    return <BudgetReport data={data} />;
  }

  return (
    <FinancialReport
      data={data}
      kind={kind}
    />
  );
}


// ============================================================
// FINANCIAL REPORT
// ============================================================

function FinancialReport({
  data,
  kind,
}: {
  data: Record<string, unknown>;
  kind: ReportKey;
}) {

  const entries =
    Object.entries(data).filter(
      ([k]) =>
        !k.startsWith('_') &&
        k !== 'links'
    );

  const isPL =
    kind === 'profit-loss';

  return (
    <div className="card p-6">

      <div className="mb-6">

        <h4 className="text-base font-semibold text-slate-100">
          {isPL
            ? 'Profit & Loss Statement'
            : 'Balance Sheet'}
        </h4>

        <p className="text-xs text-slate-500">
          As of {new Date().toLocaleDateString()}
        </p>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-ink-700">

              <th className="th">
                Item
              </th>

              <th className="th text-right">
                Amount
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-ink-800">

            {entries.map(([key, value]) => {

              const isObj =
                value &&
                typeof value === 'object' &&
                !Array.isArray(value);

              if (isObj) {

                const subEntries =
                  Object.entries(
                    value as Record<string, unknown>
                  );

                return (
                  <tbody key={key}>

                    <tr className="bg-ink-900/50">

                      <td className="td font-semibold text-slate-200">
                        {formatLabel(key)}
                      </td>

                      <td className="td text-right">
                      </td>

                    </tr>

                    {subEntries.map(([sk, sv]) => (

                      <tr key={`${key}-${sk}`}>

                        <td className="td pl-8 text-slate-400">
                          {formatLabel(sk)}
                        </td>

                        <td className="td text-right font-mono">
                          {fmtMoney(sv)}
                        </td>

                      </tr>

                    ))}

                  </tbody>
                );
              }

              return (
                <tr key={key}>

                  <td className="td font-medium text-slate-200">
                    {formatLabel(key)}
                  </td>

                  <td className="td text-right font-mono">
                    {fmtMoney(value)}
                  </td>

                </tr>
              );

            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}


// ============================================================
// BUDGET REPORT
// ============================================================

function BudgetReport({
  data,
}: {
  data: Record<string, unknown>;
}) {

  const entries =
    Object.entries(data).filter(
      ([k]) =>
        !k.startsWith('_') &&
        k !== 'links'
    );

  const barData =
    entries
      .filter(([, v]) => typeof v === 'number')
      .map(([k, v]) => ({
        label: formatLabel(k).slice(0, 12),
        value: Number(v),
      }))
      .slice(0, 12);

  return (
    <div className="space-y-4">

      <div className="card p-5">

        <h4 className="font-semibold text-slate-100 mb-4">
          Budget vs Actual
        </h4>

        <BarChart
          data={barData}
          color="#11e0c3"
          format={(n) => fmtMoney(n)}
          height={220}
        />

      </div>

      <div className="card p-6">

        <table className="w-full">

          <thead>

            <tr className="border-b border-ink-700">

              <th className="th">
                Category
              </th>

              <th className="th text-right">
                Amount
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-ink-800">

            {entries.map(([k, v]) => (

              <tr key={k}>

                <td className="td font-medium">
                  {formatLabel(k)}
                </td>

                <td className="td text-right font-mono">
                  {fmtMoney(v)}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}


// ============================================================
// POWER SUMMARY
// ============================================================

function PowerSummary({
  data,
}: {
  data: Record<string, unknown>;
}) {

  const entries =
    Object.entries(data).filter(
      ([k]) =>
        !k.startsWith('_') &&
        k !== 'links'
    );

  const numEntries =
    entries.filter(
      ([, v]) => typeof v === 'number'
    );

  const objEntries =
    entries.filter(
      ([, v]) =>
        v &&
        typeof v === 'object' &&
        !Array.isArray(v)
    );

  const totalLights =
    readField(data, 'totalLights');

  const activeLights =
    readField(data, 'activeLights');

  const totalEnergy =
    readField(data, 'totalEnergy') ??
    readField(data, 'totalEnergyKwh');

  const avgPower =
    readField(data, 'averagePower') ??
    readField(data, 'avgPower');

  const totalRatedPower =
    readField(data, 'totalRatedPower') ??
    readField(data, 'totalPower');

  const kpiCards = [
    {
      label: 'Total Lights',
      value: fmtNum(totalLights),
      color: 'text-slate-100',
    },
    {
      label: 'Active Lights',
      value: fmtNum(activeLights),
      color: 'text-accent-400',
    },
    {
      label: 'Total Energy',
      value: `${fmtNum(totalEnergy, 1)} kWh`,
      color: 'text-warn-400',
    },
    {
      label: 'Avg Power',
      value: `${fmtNum(avgPower, 1)} W`,
      color: 'text-steel-400',
    },
  ];

  const barData =
    numEntries.map(([k, v]) => ({
      label: formatLabel(k).slice(0, 12),
      value: Number(v),
    }));

  return (
    <div className="space-y-4">

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {kpiCards.map((c) => (

          <div
            key={c.label}
            className="card p-4"
          >

            <p className="text-xs text-slate-500">
              {c.label}
            </p>

            <p
              className={`text-2xl font-bold ${c.color}`}
            >
              {c.value}
            </p>

          </div>

        ))}

        {totalRatedPower != null && (

          <div className="card p-4">

            <p className="text-xs text-slate-500">
              Total Rated Power
            </p>

            <p className="text-2xl font-bold text-slate-100">
              {fmtNum(totalRatedPower)} W
            </p>

          </div>

        )}

      </div>

      {/* Chart */}
      {barData.length > 0 && (

        <div className="card p-5">

          <h4 className="font-semibold text-slate-100 mb-4">
            Power Summary Chart
          </h4>

          <BarChart
            data={barData}
            color="#ffa81f"
            format={(n) => fmtNum(n, 0)}
            height={200}
          />

        </div>

      )}

      {/* Object Data */}
      {objEntries.map(([key, val]) => {

        const sub =
          Object.entries(
            val as Record<string, unknown>
          );

        return (

          <div
            key={key}
            className="card p-6"
          >

            <h4 className="font-semibold text-slate-100 mb-4">
              {formatLabel(key)}
            </h4>

            <table className="w-full">

              <thead>

                <tr className="border-b border-ink-700">

                  <th className="th">
                    Item
                  </th>

                  <th className="th text-right">
                    Value
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-ink-800">

                {sub.map(([sk, sv]) => (

                  <tr key={sk}>

                    <td className="td font-medium">
                      {formatLabel(sk)}
                    </td>

                    <td className="td text-right font-mono">
                      {typeof sv === 'number'
                        ? fmtNum(sv)
                        : String(sv || '—')}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        );
      })}

      {/* Empty State */}
      {entries.length === 0 && (

        <div className="card p-8 text-center text-slate-500">
          No power summary data available
        </div>

      )}

    </div>
  );
}


// ============================================================
// FORMAT LABEL
// ============================================================

function formatLabel(key: string): string {

  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/_/g, ' ')
    .trim();
}