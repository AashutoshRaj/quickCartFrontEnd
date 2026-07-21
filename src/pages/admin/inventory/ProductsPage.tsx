import { useState } from 'react';
import { InventoryOverview } from '../../../components/admin-app/components/InventoryOverview';
import { InventorySearch } from '../../../components/admin-app/components/InventorySearch';
import { ProductInventoryTable } from '../../../components/admin-app/components/ProductInventoryTable';

export function ProductsPage() {
  const [searchFilters, setSearchFilters] = useState({
    productName: '',
    barcode: '',
    category: '',
    stockStatus: '',
    priceRange: { min: '', max: '' },
  });

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>Products</h1>
        <p className="text-sm text-gray-500 mt-0.5">52,400 products across all categories</p>
      </div>
      <InventoryOverview />
      <InventorySearch filters={searchFilters} onFiltersChange={setSearchFilters} />
      <ProductInventoryTable filters={searchFilters} />
    </div>
  );
}
