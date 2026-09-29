import {
  LayoutDashboard, Lightbulb, Activity, Wrench, Building2, Users, Package,
  Receipt, BookOpen, Wallet, FileBarChart, Zap, X,
} from 'lucide-react';

export type PageKey =
  | 'dashboard' | 'lights' | 'telemetry' | 'maintenance'
  | 'vendors' | 'customers' | 'products'
  | 'transactions' | 'accounting' | 'budgets' | 'reports';

interface NavItem {
  key: PageKey;
  label: string;
  icon: typeof LayoutDashboard;
  group: string;
}

const nav: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Overview' },
  { key: 'lights', label: 'Smart Street Lights', icon: Lightbulb, group: 'Overview' },
  { key: 'telemetry', label: 'Telemetry & Energy', icon: Activity, group: 'Overview' },
  { key: 'maintenance', label: 'Maintenance Tickets', icon: Wrench, group: 'Overview' },
  { key: 'vendors', label: 'Vendors', icon: Building2, group: 'Master Data' },
  { key: 'customers', label: 'Customers', icon: Users, group: 'Master Data' },
  { key: 'products', label: 'Products', icon: Package, group: 'Master Data' },
  { key: 'transactions', label: 'Transactions & Payments', icon: Receipt, group: 'Finance' },
  { key: 'accounting', label: 'Accounting', icon: BookOpen, group: 'Finance' },
  { key: 'budgets', label: 'Budgets', icon: Wallet, group: 'Finance' },
  { key: 'reports', label: 'Reports', icon: FileBarChart, group: 'Finance' },
];

interface SidebarProps {
  current: PageKey;
  onNavigate: (page: PageKey) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ current, onNavigate, mobileOpen, onCloseMobile }: SidebarProps) {
  const groups = [...new Set(nav.map((n) => n.group))];

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-ink-950/70 z-30 lg:hidden" onClick={onCloseMobile} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-ink-900 border-r border-ink-700 flex flex-col transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-700">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-accent-500 flex items-center justify-center shadow-glow-accent">
              <Zap className="w-5 h-5 text-ink-950" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100 leading-none">GridScape</h1>
              <p className="text-[10px] text-slate-500 mt-0.5">Energy Control Center</p>
            </div>
          </div>
          <button onClick={onCloseMobile} className="lg:hidden btn-ghost p-1.5 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
          {groups.map((group) => (
            <div key={group}>
              <p className="px-3 mb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-wider">{group}</p>
              <div className="space-y-0.5">
                {nav.filter((n) => n.group === group).map((item) => {
                  const Icon = item.icon;
                  const active = current === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => { onNavigate(item.key); onCloseMobile(); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-ink-800 border border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-ink-700">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
            <span>System Online</span>
            <span className="ml-auto font-mono">v2.4.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
