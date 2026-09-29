import { Menu, Bell, Search, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
}

export default function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-ink-900/90 backdrop-blur-md border-b border-ink-700 px-4 lg:px-6 py-3.5">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden btn-ghost p-2 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-slate-100 truncate">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 truncate hidden sm:block">{subtitle}</p>}
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-ink-800 border border-ink-700 rounded-lg w-56">
          <Search className="w-4 h-4 text-slate-500" />
          <input className="bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none flex-1" placeholder="Search…" />
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-ink-800 border border-ink-700 rounded-lg">
          <Clock className="w-4 h-4 text-accent-400" />
          <span className="text-sm font-mono text-slate-300 tabular-nums">
            {now.toLocaleTimeString('en-US', { hour12: false })}
          </span>
        </div>

        <button className="btn-ghost p-2 rounded-lg relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-warn-400" />
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-ink-700">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-steel-500 to-steel-700 flex items-center justify-center text-sm font-bold text-slate-100">
            OP
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-slate-200 leading-none">Operator</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Municipal Grid</p>
          </div>
        </div>
      </div>
    </header>
  );
}
