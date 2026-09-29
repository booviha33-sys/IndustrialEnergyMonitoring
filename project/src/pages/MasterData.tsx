import ResourcePage from '@/components/ResourcePage';
import { vendorDef, customerDef, productDef } from '@/lib/defs';

export function VendorsPage() { return <ResourcePage def={vendorDef} />; }
export function CustomersPage() { return <ResourcePage def={customerDef} />; }
export function ProductsPage() { return <ResourcePage def={productDef} />; }
