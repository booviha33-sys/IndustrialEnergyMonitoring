import { type ReactNode } from 'react';

interface Column<T> {
  key: string;
  label: string;
  render?: (value: unknown, row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  empty?: string;
  rowKey?: (row: T, i: number) => string;
  actions?: (row: T) => ReactNode;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  loading,
  empty = 'No records found.',
  rowKey,
  actions,
}: DataTableProps<T>) {
  const allCols = actions ? [...columns, { key: '__actions', label: 'Actions', className: 'text-right' }] : columns;

  return (
    <div className="table-wrap">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-ink-900/80 border-b border-ink-700">
            <tr>
              {allCols.map((col) => (
                <th key={col.key} className={`th ${col.className || ''}`}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-800">
            {loading ? (
              <tr>
                <td colSpan={allCols.length} className="td text-center py-12 text-slate-500">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
                    Loading…
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={allCols.length} className="td text-center py-12 text-slate-500">{empty}</td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={rowKey ? rowKey(row, i) : i} className="hover:bg-ink-800/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={`td ${col.className || ''}`}>
                      {col.render ? col.render(row[col.key], row) : ((row[col.key] ?? '—') as React.ReactNode)}
                    </td>
                  ))}
                  {actions && (
                    <td className="td text-right whitespace-nowrap">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
