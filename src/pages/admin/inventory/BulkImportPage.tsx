import React from 'react';
import { ProductImportCenter } from '../../../components/admin-app/components/ProductImportCenter';
import { ImportHistory } from '../../../components/admin-app/components/ImportHistory';
import { ProductList } from '../../../components/admin-app/components/ProductList';
import { useImportProducts } from '../../../admin-hooks/import/useImportProducts';

export function BulkImportPage() {
  const { isSuccess } = useImportProducts();

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>
          Bulk Product Import
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Upload CSV or Excel files containing up to 50,000+ products
        </p>
      </div>

      <ProductImportCenter />

      <ImportHistory />
      <ProductList key={isSuccess ? `imported-${Date.now()}` : 'default'} />
    </div>
  );
}
