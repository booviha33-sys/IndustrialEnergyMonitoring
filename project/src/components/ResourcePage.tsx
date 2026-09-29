import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, AlertCircle, WifiOff } from 'lucide-react';
import DataTable from './DataTable';
import FormModal from './FormModal';
import { type ResourceDef, readField, fmtDate, fmtMoney } from '@/lib/types';
import { apiList, apiCreate, apiUpdate, apiDelete, pickId, isOffline } from '@/lib/api';

interface ResourcePageProps {
  def: ResourceDef;
}

export default function ResourcePage({ def }: ResourcePageProps) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);

  const canCreate = def.canCreate !== false;
  const canEdit = def.canEdit !== false;
  const canDelete = def.canDelete !== false;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setOffline(false);
    try {
      const data = await apiList<Record<string, unknown>>(def.endpoint);
      setRows(data);
    } catch (e) {
      if (isOffline(e)) setOffline(true);
      else setError(e instanceof Error ? e.message : 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, [def.endpoint]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (editing) {
        const id = pickId(editing);
        await apiUpdate(`${def.endpoint}/${id}`, data);
      } else {
        await apiCreate(def.endpoint, data);
      }
      setModalOpen(false);
      setEditing(null);
      load();
    } catch (e) {
      if (isOffline(e)) setOffline(true);
      else setError(e instanceof Error ? e.message : 'Save failed');
    }
  };

  const handleDelete = async (row: Record<string, unknown>) => {
    const id = pickId(row);
    try {
      await apiDelete(`${def.endpoint}/${id}`);
      load();
    } catch (e) {
      if (isOffline(e)) setOffline(true);
      else setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const columns = def.columns.map((col) => ({
    key: col.key,
    label: col.label,
    className: col.className,
    render: col.render
      ? (val: unknown, row: Record<string, unknown>) => col.render!(val, row)
      : (val: unknown) => {
          if (typeof val === 'number') return fmtMoney(val);
          if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val)) return fmtDate(val);
          if (val === null || val === undefined) return '—';
          return String(val);
        },
  }));

  const showActions = canEdit || canDelete;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{def.name}</h3>
          <p className="text-sm text-slate-500">{rows.length} record{rows.length !== 1 ? 's' : ''}</p>
        </div>
        {canCreate && (
          <button className="btn-primary" onClick={() => { setEditing(null); setModalOpen(true); }}>
            <Plus className="w-4 h-4" /> Add {def.singular}
          </button>
        )}
      </div>

      {offline && <OfflineBanner />}
      {error && !offline && (
        <div className="card p-4 border-danger-500/30 bg-danger-500/5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-danger-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-danger-300">Error</p>
            <p className="text-xs text-slate-400 mt-1">{error}</p>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        rowKey={(row, i) => String(pickId(row) ?? i)}
        actions={showActions ? (row) => (
          <div className="flex items-center justify-end gap-1">
            {canEdit && (
              <button className="btn-ghost p-1.5 rounded" onClick={() => { setEditing(row); setModalOpen(true); }}>
                <Pencil className="w-4 h-4" />
              </button>
            )}
            {canDelete && (
              <button className="btn-ghost p-1.5 rounded hover:text-danger-400" onClick={() => handleDelete(row)}>
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : undefined}
      />

      {canCreate && (
        <FormModal
          open={modalOpen}
          title={editing ? `Edit ${def.singular}` : `Add ${def.singular}`}
          fields={def.fields}
          initial={editing ?? {}}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSubmit={handleSubmit}
          submitLabel={editing ? 'Update' : 'Create'}
        />
      )}
    </div>
  );
}

export function OfflineBanner() {
  return (
    <div className="card p-4 border-warn-500/30 bg-warn-500/5 flex items-start gap-3">
      <WifiOff className="w-5 h-5 text-warn-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-warn-300">Backend Offline</p>
        <p className="text-xs text-slate-400 mt-1">
          Cannot reach the Spring Boot API at localhost:8080. Start the backend server to load live data.
        </p>
      </div>
    </div>
  );
}

export { readField };
