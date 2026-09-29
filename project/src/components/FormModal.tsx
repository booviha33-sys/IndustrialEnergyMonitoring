import { type ReactNode, useState } from 'react';
import Modal from './Modal';
import FormField from './FormField';
import { type FieldConfig } from '@/lib/types';

export interface FormModalProps {
  open: boolean;
  title: string;
  fields: FieldConfig[];
  initial?: Record<string, unknown>;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => void;
  submitLabel?: string;
}

export default function FormModal({ open, title, fields, initial, onClose, onSubmit, submitLabel = 'Save' }: FormModalProps) {
  const [data, setData] = useState<Record<string, string>>(() => {
    const obj: Record<string, string> = {};
    for (const f of fields) {
      const v = initial?.[f.key];
      obj[f.key] = v !== undefined && v !== null ? String(v) : '';
    }
    return obj;
  });

  const handleChange = (key: string, value: string) => setData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    const out: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = data[f.key];
      if (f.type === 'number') {
        out[f.key] = raw === '' ? null : Number(raw);
      } else {
        out[f.key] = raw || null;
      }
    }
    onSubmit(out);
  };

  const footer: ReactNode = (
    <>
      <button className="btn-secondary" onClick={onClose}>Cancel</button>
      <button className="btn-primary" onClick={handleSubmit}>{submitLabel}</button>
    </>
  );

  return (
    <Modal open={open} title={title} onClose={onClose} footer={footer}>
      <div className="grid md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <FormField key={f.key} field={f} value={data[f.key]} onChange={handleChange} />
        ))}
      </div>
    </Modal>
  );
}
