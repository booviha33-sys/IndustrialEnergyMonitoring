import { useState } from 'react';
import Sidebar, { type PageKey } from '@/components/Sidebar';
import Header from '@/components/Header';
import Dashboard from '@/pages/Dashboard';
import StreetLights from '@/pages/StreetLights';
import Telemetry from '@/pages/Telemetry';
import Maintenance from '@/pages/Maintenance';
import Transactions from '@/pages/Transactions';
import Accounting from '@/pages/Accounting';
import Budgets from '@/pages/Budgets';
import Reports from '@/pages/Reports';
import { VendorsPage, CustomersPage, ProductsPage } from '@/pages/MasterData';

const pageMeta: Record<PageKey, { title: string; subtitle: string }> = {
  dashboard: { title: 'Control Center Dashboard', subtitle: 'Real-time overview of grid operations' },
  lights: { title: 'Smart Street Lights', subtitle: 'Monitor and control street light poles' },
  telemetry: { title: 'Telemetry & Energy', subtitle: 'Electrical readings and consumption trends' },
  maintenance: { title: 'Maintenance Tickets', subtitle: 'Fault reports and repair tracking' },
  vendors: { title: 'Vendors', subtitle: 'Supplier directory and contacts' },
  customers: { title: 'Customers', subtitle: 'Customer accounts and contacts' },
  products: { title: 'Products', subtitle: 'Product catalog and inventory' },
  transactions: { title: 'Transactions & Payments', subtitle: 'Orders, invoices, bills, and payments' },
  accounting: { title: 'Accounting', subtitle: 'Journal entries, zones, and chart of accounts' },
  budgets: { title: 'Budgets', subtitle: 'Fiscal planning and actual vs planned' },
  reports: { title: 'Reports', subtitle: 'Financial and operational statements' },
};

function App() {
  const [page, setPage] = useState<PageKey>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const meta = pageMeta[page];

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard />;
      case 'lights': return <StreetLights />;
      case 'telemetry': return <Telemetry />;
      case 'maintenance': return <Maintenance />;
      case 'vendors': return <VendorsPage />;
      case 'customers': return <CustomersPage />;
      case 'products': return <ProductsPage />;
      case 'transactions': return <Transactions />;
      case 'accounting': return <Accounting />;
      case 'budgets': return <Budgets />;
      case 'reports': return <Reports />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-ink-950">
      <Sidebar current={page} onNavigate={setPage} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={meta.title} subtitle={meta.subtitle} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
