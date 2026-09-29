import { type FieldConfig } from '@/lib/types';

interface FormFieldProps {
  field: FieldConfig;
  value: string | number;
  onChange: (key: string, value: string) => void;
}

export default function FormField({ field, value, onChange }: FormFieldProps) {
  const colSpan = field.full ? 'md:col-span-2' : '';

  return (
    <div className={colSpan}>
      <label className="label">{field.label}{field.required && <span className="text-danger-400 ml-0.5">*</span>}</label>
      {field.type === 'textarea' ? (
        <textarea
          className="input min-h-[80px] resize-y"
          value={String(value ?? '')}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      ) : field.type === 'select' ? (
        <select
          className="input cursor-pointer"
          value={String(value ?? '')}
          onChange={(e) => onChange(field.key, e.target.value)}
        >
          <option value="">Select…</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={field.type || 'text'}
          className="input"
          value={String(value ?? '')}
          min={field.min}
          max={field.max}
          step={field.step}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      )}
    </div>
  );
}
