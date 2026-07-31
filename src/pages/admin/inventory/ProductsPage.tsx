import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { InventoryOverview } from '../../../components/admin-app/components/InventoryOverview';
import { InventorySearch } from '../../../components/admin-app/components/InventorySearch';
import { ProductInventoryTable } from '../../../components/admin-app/components/ProductInventoryTable';
import { ProductImportCenter } from '../../../components/admin-app/components/ProductImportCenter';

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || '';
  const [searchFilters, setSearchFilters] = useState({
    productName: '',
    barcode: '',
    category: categoryFromUrl,
    stockStatus: '',
    priceRange: { min: '', max: '' },
  });

  useEffect(() => {
    setSearchFilters((current) => ({ ...current, category: categoryFromUrl }));
  }, [categoryFromUrl]);

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>Products</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your store's product inventory</p>
      </div>
      <ProductImportCenter />
      <InventoryOverview />
      <InventorySearch filters={searchFilters} onFiltersChange={setSearchFilters} />
      <ProductInventoryTable filters={searchFilters} />
    </div>
  );
}
