import { type ResourceDef } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import { readField, fmtDate, fmtMoney, fmtNum } from '@/lib/types';

export const vendorDef: ResourceDef = {
  name: 'Vendors',
  singular: 'Vendor',
  endpoint: '/api/vendors',
  titleField: 'name',
  fields: [
    { key: 'name', label: 'Vendor Name', required: true, full: true },
    { key: 'contactPerson', label: 'Contact Person' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'tel' },
    { key: 'address', label: 'Address', full: true },
    { key: 'taxId', label: 'Tax ID' },
    { key: 'paymentTerms', label: 'Payment Terms' },
  ],
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'contactPerson', label: 'Contact' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'paymentTerms', label: 'Terms' },
  ],
};

export const customerDef: ResourceDef = {
  name: 'Customers',
  singular: 'Customer',
  endpoint: '/api/customers',
  titleField: 'name',
  fields: [
    { key: 'name', label: 'Customer Name', required: true, full: true },
    { key: 'contactPerson', label: 'Contact Person' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'tel' },
    { key: 'address', label: 'Address', full: true },
    { key: 'zone', label: 'Zone' },
    { key: 'taxId', label: 'Tax ID' },
  ],
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'contactPerson', label: 'Contact' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'zone', label: 'Zone' },
  ],
};

export const productDef: ResourceDef = {
  name: 'Products',
  singular: 'Product',
  endpoint: '/api/products',
  titleField: 'name',
  fields: [
    { key: 'name', label: 'Product Name', required: true, full: true },
    { key: 'sku', label: 'SKU', required: true },
    { key: 'category', label: 'Category' },
    { key: 'unit', label: 'Unit of Measure' },
    { key: 'unitPrice', label: 'Unit Price', type: 'number', step: '0.01', min: 0 },
    { key: 'stockQty', label: 'Stock Qty', type: 'number', min: 0 },
    { key: 'description', label: 'Description', type: 'textarea', full: true },
  ],
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'sku', label: 'SKU' },
    { key: 'category', label: 'Category' },
    { key: 'unit', label: 'UoM' },
    { key: 'unitPrice', label: 'Price', render: (v) => fmtMoney(v) },
    { key: 'stockQty', label: 'Stock', render: (v) => fmtNum(v) },
  ],
};

export const accountDef: ResourceDef = {
  name: 'Chart of Accounts',
  singular: 'Account',
  endpoint: '/api/accounts',
  titleField: 'name',
  fields: [
    { key: 'code', label: 'Account Code', required: true },
    { key: 'name', label: 'Account Name', required: true, full: true },
    { key: 'type', label: 'Type', type: 'select', options: [
      { value: 'ASSET', label: 'Asset' },
      { value: 'LIABILITY', label: 'Liability' },
      { value: 'EQUITY', label: 'Equity' },
      { value: 'REVENUE', label: 'Revenue' },
      { value: 'EXPENSE', label: 'Expense' },
    ]},
    { key: 'subtype', label: 'Subtype' },
    { key: 'balance', label: 'Opening Balance', type: 'number', step: '0.01' },
  ],
  columns: [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type', render: (v) => <StatusBadge status={String(v)} variant="info" /> },
    { key: 'subtype', label: 'Subtype' },
    { key: 'balance', label: 'Balance', render: (v) => fmtMoney(v) },
  ],
};

export const purchaseOrderDef: ResourceDef = {
  name: 'Purchase Orders',
  singular: 'Purchase Order',
  endpoint: '/api/purchase-orders',
  canDelete: false,
  fields: [
    { key: 'poNumber', label: 'PO Number', required: true },
    { key: 'vendorId', label: 'Vendor ID', type: 'number' },
    { key: 'orderDate', label: 'Order Date', type: 'date' },
    { key: 'expectedDate', label: 'Expected Date', type: 'date' },
    { key: 'totalAmount', label: 'Total Amount', type: 'number', step: '0.01' },
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'DRAFT', label: 'Draft' },
      { value: 'PENDING', label: 'Pending' },
      { value: 'APPROVED', label: 'Approved' },
      { value: 'RECEIVED', label: 'Received' },
      { value: 'CLOSED', label: 'Closed' },
    ]},
  ],
  columns: [
    { key: 'poNumber', label: 'PO Number' },
    { key: 'vendorId', label: 'Vendor' },
    { key: 'orderDate', label: 'Order Date', render: (v) => fmtDate(v) },
    { key: 'totalAmount', label: 'Amount', render: (v) => fmtMoney(v) },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v || 'draft')} /> },
  ],
};

export const vendorBillDef: ResourceDef = {
  name: 'Vendor Bills',
  singular: 'Vendor Bill',
  endpoint: '/api/vendor-bills',
  canDelete: false,
  fields: [
    { key: 'billNumber', label: 'Bill Number', required: true },
    { key: 'vendorId', label: 'Vendor ID', type: 'number' },
    { key: 'billDate', label: 'Bill Date', type: 'date' },
    { key: 'dueDate', label: 'Due Date', type: 'date' },
    { key: 'amount', label: 'Amount', type: 'number', step: '0.01' },
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'PENDING', label: 'Pending' },
      { value: 'PAID', label: 'Paid' },
      { value: 'OVERDUE', label: 'Overdue' },
    ]},
  ],
  columns: [
    { key: 'billNumber', label: 'Bill #' },
    { key: 'vendorId', label: 'Vendor' },
    { key: 'billDate', label: 'Date', render: (v) => fmtDate(v) },
    { key: 'dueDate', label: 'Due', render: (v) => fmtDate(v) },
    { key: 'amount', label: 'Amount', render: (v) => fmtMoney(v) },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v || 'pending')} /> },
  ],
};

export const salesOrderDef: ResourceDef = {
  name: 'Sales Orders',
  singular: 'Sales Order',
  endpoint: '/api/sales-orders',
  canDelete: false,
  fields: [
    { key: 'soNumber', label: 'SO Number', required: true },
    { key: 'customerId', label: 'Customer ID', type: 'number' },
    { key: 'orderDate', label: 'Order Date', type: 'date' },
    { key: 'deliveryDate', label: 'Delivery Date', type: 'date' },
    { key: 'totalAmount', label: 'Total Amount', type: 'number', step: '0.01' },
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'DRAFT', label: 'Draft' },
      { value: 'PENDING', label: 'Pending' },
      { value: 'APPROVED', label: 'Approved' },
      { value: 'FULFILLED', label: 'Fulfilled' },
      { value: 'CLOSED', label: 'Closed' },
    ]},
  ],
  columns: [
    { key: 'soNumber', label: 'SO Number' },
    { key: 'customerId', label: 'Customer' },
    { key: 'orderDate', label: 'Date', render: (v) => fmtDate(v) },
    { key: 'totalAmount', label: 'Amount', render: (v) => fmtMoney(v) },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v || 'draft')} /> },
  ],
};

export const customerInvoiceDef: ResourceDef = {
  name: 'Customer Invoices',
  singular: 'Invoice',
  endpoint: '/api/customer-invoices',
  canDelete: false,
  fields: [
    { key: 'invoiceNumber', label: 'Invoice #', required: true },
    { key: 'customerId', label: 'Customer ID', type: 'number' },
    { key: 'invoiceDate', label: 'Invoice Date', type: 'date' },
    { key: 'dueDate', label: 'Due Date', type: 'date' },
    { key: 'amount', label: 'Amount', type: 'number', step: '0.01' },
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'DRAFT', label: 'Draft' },
      { value: 'SENT', label: 'Sent' },
      { value: 'PAID', label: 'Paid' },
      { value: 'OVERDUE', label: 'Overdue' },
    ]},
  ],
  columns: [
    { key: 'invoiceNumber', label: 'Invoice #' },
    { key: 'customerId', label: 'Customer' },
    { key: 'invoiceDate', label: 'Date', render: (v) => fmtDate(v) },
    { key: 'amount', label: 'Amount', render: (v) => fmtMoney(v) },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v || 'draft')} /> },
  ],
};

export const repairBillDef: ResourceDef = {
  name: 'Repair Bills',
  singular: 'Repair Bill',
  endpoint: '/api/repair-bills',
  canDelete: false,
  fields: [
    { key: 'billNumber', label: 'Bill #', required: true },
    { key: 'streetLightId', label: 'Street Light ID', type: 'number' },
    { key: 'repairDate', label: 'Repair Date', type: 'date' },
    { key: 'cost', label: 'Cost', type: 'number', step: '0.01' },
    { key: 'description', label: 'Description', type: 'textarea', full: true },
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'PENDING', label: 'Pending' },
      { value: 'PAID', label: 'Paid' },
    ]},
  ],
  columns: [
    { key: 'billNumber', label: 'Bill #' },
    { key: 'streetLightId', label: 'Light ID' },
    { key: 'repairDate', label: 'Date', render: (v) => fmtDate(v) },
    { key: 'cost', label: 'Cost', render: (v) => fmtMoney(v) },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v || 'pending')} /> },
  ],
};

export const paymentDef: ResourceDef = {
  name: 'Utility Payments',
  singular: 'Payment',
  endpoint: '/api/payments',
  canEdit: false,
  canDelete: false,
  fields: [
    { key: 'paymentNumber', label: 'Payment #', required: true },
    { key: 'payee', label: 'Payee' },
    { key: 'paymentDate', label: 'Payment Date', type: 'date' },
    { key: 'amount', label: 'Amount', type: 'number', step: '0.01' },
    { key: 'method', label: 'Method', type: 'select', options: [
      { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
      { value: 'CHECK', label: 'Check' },
      { value: 'CASH', label: 'Cash' },
      { value: 'CARD', label: 'Card' },
    ]},
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'PENDING', label: 'Pending' },
      { value: 'PAID', label: 'Paid' },
    ]},
  ],
  columns: [
    { key: 'paymentNumber', label: 'Payment #' },
    { key: 'payee', label: 'Payee' },
    { key: 'paymentDate', label: 'Date', render: (v) => fmtDate(v) },
    { key: 'amount', label: 'Amount', render: (v) => fmtMoney(v) },
    { key: 'method', label: 'Method' },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v || 'pending')} /> },
  ],
};

export const municipalPaymentDef: ResourceDef = {
  name: 'Municipal Payments',
  singular: 'Municipal Payment',
  endpoint: '/api/municipal-payments',
  canEdit: false,
  canDelete: false,
  fields: [
    { key: 'reference', label: 'Reference #', required: true },
    { key: 'department', label: 'Department' },
    { key: 'paymentDate', label: 'Payment Date', type: 'date' },
    { key: 'amount', label: 'Amount', type: 'number', step: '0.01' },
    { key: 'purpose', label: 'Purpose', full: true },
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'PENDING', label: 'Pending' },
      { value: 'PAID', label: 'Paid' },
    ]},
  ],
  columns: [
    { key: 'reference', label: 'Reference' },
    { key: 'department', label: 'Department' },
    { key: 'paymentDate', label: 'Date', render: (v) => fmtDate(v) },
    { key: 'amount', label: 'Amount', render: (v) => fmtMoney(v) },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v || 'pending')} /> },
  ],
};

export const journalDef: ResourceDef = {
  name: 'Journal Entries',
  singular: 'Journal Entry',
  endpoint: '/api/journals',
  canEdit: false,
  canDelete: false,
  fields: [
    { key: 'entryNumber', label: 'Entry #', required: true },
    { key: 'entryDate', label: 'Entry Date', type: 'date' },
    { key: 'description', label: 'Description', full: true },
    { key: 'period', label: 'Period' },
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'DRAFT', label: 'Draft' },
      { value: 'POSTED', label: 'Posted' },
    ]},
  ],
  columns: [
    { key: 'entryNumber', label: 'Entry #' },
    { key: 'entryDate', label: 'Date', render: (v) => fmtDate(v) },
    { key: 'description', label: 'Description' },
    { key: 'period', label: 'Period' },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v || 'draft')} /> },
  ],
};

export const zoneDef: ResourceDef = {
  name: 'Analytic Zones',
  singular: 'Zone',
  endpoint: '/api/zones',
  canDelete: false,
  fields: [
    { key: 'code', label: 'Zone Code', required: true },
    { key: 'name', label: 'Zone Name', required: true, full: true },
    { key: 'area', label: 'Area' },
    { key: 'manager', label: 'Manager' },
  ],
  columns: [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'area', label: 'Area' },
    { key: 'manager', label: 'Manager' },
  ],
};

export const budgetDef: ResourceDef = {
  name: 'Budgets',
  singular: 'Budget',
  endpoint: '/api/budgets',
  fields: [
    { key: 'name', label: 'Budget Name', required: true, full: true },
    { key: 'fiscalYear', label: 'Fiscal Year', type: 'number' },
    { key: 'zoneId', label: 'Zone ID', type: 'number' },
    { key: 'plannedAmount', label: 'Planned Amount', type: 'number', step: '0.01' },
    { key: 'actualAmount', label: 'Actual Amount', type: 'number', step: '0.01' },
    { key: 'category', label: 'Category' },
  ],
  columns: [
    { key: 'name', label: 'Budget' },
    { key: 'fiscalYear', label: 'FY' },
    { key: 'category', label: 'Category' },
    { key: 'plannedAmount', label: 'Planned', render: (v) => fmtMoney(v) },
    { key: 'actualAmount', label: 'Actual', render: (v) => fmtMoney(v) },
    { key: 'variance', label: 'Variance', render: (_v, row) => {
      const planned = Number(readField(row, 'plannedAmount') || 0);
      const actual = Number(readField(row, 'actualAmount') || 0);
      const variance = planned - actual;
      return <span className={variance >= 0 ? 'text-accent-400' : 'text-danger-400'}>{fmtMoney(variance)}</span>;
    }},
  ],
};

export const maintenanceDef: ResourceDef = {
  name: 'Maintenance Tickets',
  singular: 'Ticket',
  endpoint: '/api/maintenance-tickets',
  fields: [
    { key: 'ticketId', label: 'Ticket ID', required: true },
    { key: 'streetLightId', label: 'Street Light ID', type: 'number', required: true },
    { key: 'faultType', label: 'Fault Type', type: 'select', options: [
      { value: 'BULB_FAILURE', label: 'Bulb Failure' },
      { value: 'POWER_OUTAGE', label: 'Power Outage' },
      { value: 'SENSOR_FAULT', label: 'Sensor Fault' },
      { value: 'PHYSICAL_DAMAGE', label: 'Physical Damage' },
      { value: 'WIRING_ISSUE', label: 'Wiring Issue' },
      { value: 'OTHER', label: 'Other' },
    ]},
    { key: 'description', label: 'Description', type: 'textarea', full: true },
    { key: 'priority', label: 'Priority', type: 'select', options: [
      { value: 'LOW', label: 'Low' },
      { value: 'MEDIUM', label: 'Medium' },
      { value: 'HIGH', label: 'High' },
      { value: 'CRITICAL', label: 'Critical' },
    ]},
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'OPEN', label: 'Open' },
      { value: 'IN_PROGRESS', label: 'In Progress' },
      { value: 'RESOLVED', label: 'Resolved' },
      { value: 'CLOSED', label: 'Closed' },
    ]},
    { key: 'createdDate', label: 'Created Date', type: 'date' },
  ],
  columns: [
    { key: 'ticketId', label: 'Ticket ID' },
    { key: 'streetLightId', label: 'Light ID' },
    { key: 'faultType', label: 'Fault Type' },
    { key: 'priority', label: 'Priority', render: (v) => <StatusBadge status={String(v || 'low')} /> },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v || 'open')} /> },
    { key: 'createdDate', label: 'Created', render: (v) => fmtDate(v) },
  ],
};
