import { useState } from 'react';
import ResourcePage from '@/components/ResourcePage';
import {
  purchaseOrderDef, vendorBillDef, salesOrderDef, customerInvoiceDef,
  repairBillDef, paymentDef, municipalPaymentDef,
} from '@/lib/defs';
import { ShoppingCart, FileText, Package, Receipt, Wrench, Building, Landmark } from 'lucide-react';

const tabs = [
  { key: 'purchase-orders', label: 'Purchase Orders', icon: ShoppingCart, def: purchaseOrderDef },
  { key: 'vendor-bills', label: 'Vendor Bills', icon: FileText, def: vendorBillDef },
  { key: 'sales-orders', label: 'Sales Orders', icon: Package, def: salesOrderDef },
  { key: 'customer-invoices', label: 'Customer Invoices', icon: Receipt, def: customerInvoiceDef },
  { key: 'repair-bills', label: 'Repair Bills', icon: Wrench, def: repairBillDef },
  { key: 'payments', label: 'Utility Payments', icon: Building, def: paymentDef },
  { key: 'municipal-payments', label: 'Municipal Payments', icon: Landmark, def: municipalPaymentDef },
];

export default function Transactions() {
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
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
      <ResourcePage key={current.key} def={current.def} />
    </div>
  );
}
