import { useState } from 'react';
import { BookOpen, Map, LayoutGrid, ListTree, Plus } from 'lucide-react';
import ResourcePage from '@/components/ResourcePage';
import { journalDef, zoneDef, accountDef } from '@/lib/defs';
import { OfflineBanner } from '@/components/ResourcePage';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import FormField from '@/components/FormField';
import { type FieldConfig, fmtMoney, readField } from '@/lib/types';
import { apiList, apiCreate, pickId, isOffline } from '@/lib/api';
import { useEffect, useState as useReactState, useCallback } from 'react';

const lineFields: FieldConfig[] = [
  { key: 'accountId', label: 'Account ID', type: 'number', required: true },
  { key: 'debit', label: 'Debit', type: 'number', step: '0.01' },
  { key: 'credit', label: 'Credit', type: 'number', step: '0.01' },
  { key: 'description', label: 'Description', full: true },
  { key: 'zoneId', label: 'Zone ID', type: 'number' },
];

function JournalLines() {
  const [journals, setJournals] = useReactState<Record<string, unknown>[]>([]);
  const [selectedJournal, setSelectedJournal] = useReactState<string>('');
  const [lines, setLines] = useReactState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useReactState(true);
  const [offline, setOffline] = useReactState(false);
  const [modalOpen, setModalOpen] = useReactState(false);
  const [lineData, setLineData] = useReactState<Record<string, string>>({});

  const loadJournals = useCallback(async () => {
    try {
      const data = await apiList<Record<string, unknown>>('/api/journals');
      setJournals(data);
      if (data.length > 0 && !selectedJournal) {
        setSelectedJournal(String(pickId(data[0])));
      }
    } catch (e) {
      if (isOffline(e)) setOffline(true);
    }
  }, [selectedJournal]);

  const loadLines = useCallback(async () => {
    if (!selectedJournal) { setLines([]); setLoading(false); return; }
    setLoading(true);
    setOffline(false);
    try {
      const data = await apiList<Record<string, unknown>>(`/api/journals/${selectedJournal}/lines`);
      setLines(data);
    } catch (e) {
      if (isOffline(e)) setOffline(true);
      setLines([]);
    } finally {
      setLoading(false);
    }
  }, [selectedJournal]);

  useEffect(() => { loadJournals(); }, [loadJournals]);
  useEffect(() => { if (selectedJournal) loadLines(); }, [selectedJournal, loadLines]);

  const handleAddLine = async () => {
    const body: Record<string, unknown> = {};
    for (const f of lineFields) {
      const raw = lineData[f.key];
      if (f.type === 'number') body[f.key] = raw === '' ? null : Number(raw);
      else body[f.key] = raw || null;
    }
    try {
      await apiCreate(`/api/journals/${selectedJournal}/lines`, body);
      setModalOpen(false);
      setLineData({});
      loadLines();
    } catch (e) {
      if (isOffline(e)) setOffline(true);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {offline && <OfflineBanner />}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1">
          <label className="label">Select Journal Entry</label>
          <select className="input" value={selectedJournal} onChange={(e) => setSelectedJournal(e.target.value)}>
            <option value="">Select a journal…</option>
            {journals.map((j) => (
              <option key={String(pickId(j))} value={String(pickId(j))}>
                {String(readField(j, 'entryNumber') || pickId(j))}
              </option>
            ))}
          </select>
        </div>
        {selectedJournal && (
          <button className="btn-primary mt-5" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add Line
          </button>
        )}
      </div>

      <DataTable
        columns={[
          { key: 'accountId', label: 'Account ID' },
          { key: 'description', label: 'Description' },
          { key: 'debit', label: 'Debit', render: (v) => fmtMoney(v) },
          { key: 'credit', label: 'Credit', render: (v) => fmtMoney(v) },
          { key: 'zoneId', label: 'Zone ID' },
        ]}
        rows={lines}
        loading={loading}
        rowKey={(row, i) => String(pickId(row) ?? i)}
        empty={selectedJournal ? 'No journal lines found.' : 'Select a journal entry to view its lines.'}
      />

      <Modal
        open={modalOpen}
        title="Add Journal Line"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleAddLine}>Create</button>
          </>
        }
      >
        <div className="grid md:grid-cols-2 gap-4">
          {lineFields.map((f) => (
            <FormField
              key={f.key}
              field={f}
              value={lineData[f.key] ?? ''}
              onChange={(key, val) => setLineData((prev) => ({ ...prev, [key]: val }))}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}

const tabs = [
  { key: 'journals', label: 'Journal Entries', icon: BookOpen, content: <ResourcePage def={journalDef} /> },
  { key: 'lines', label: 'Journal Lines', icon: ListTree, content: <JournalLines /> },
  { key: 'zones', label: 'Analytic Zones', icon: Map, content: <ResourcePage def={zoneDef} /> },
  { key: 'accounts', label: 'Chart of Accounts', icon: LayoutGrid, content: <ResourcePage def={accountDef} /> },
];

export default function Accounting() {
  const [active, setActive] = useState(tabs[0].key);
  const current = tabs.find((t) => t.key === active)!;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="card p-1.5">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`tab-btn flex items-center gap-2 ${active === tab.key ? 'tab-active' : 'tab-inactive'}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      <div key={current.key}>{current.content}</div>
    </div>
  );
}
