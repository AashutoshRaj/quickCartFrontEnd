import { useState } from 'react';
import React from 'react';
import { ProductImportCenter } from '../../../components/admin-app/components/ProductImportCenter';
import { ImportProcessingDashboard } from '../../../components/admin-app/components/ImportProcessingDashboard';
import { ImportHistory } from '../../../components/admin-app/components/ImportHistory';
import { ProductList } from '../../../components/admin-app/components/ProductList';
import { useImportProducts } from '../../../hooks/import/useImportProducts.ts';

export function BulkImportPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<{
    totalProducts?: number;
    imported?: number;
    failed?: number;
    duplicates?: number;
    status?: 'processing' | 'completed' | 'failed';
  }>({});

  const {
    mutate: importProducts,
    isPending,
    isSuccess,
    data: importResult,
    isError,
  } = useImportProducts();

  React.useEffect(() => {
    if (isSuccess && importResult) {
      setStats({
        totalProducts: importResult.totalProducts,
        imported: importResult.imported,
        failed: importResult.failed,
        duplicates: importResult.duplicates,
        status: 'completed',
      });
      setProgress(100);
    }
  }, [isSuccess, importResult]);

  React.useEffect(() => {
    if (isError) {
      setStats({ status: 'failed' });
    }
  }, [isError]);

  const handleFileUpload = (file: File) => {
    setSelectedFile(file);
  };

  const handleImport = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    importProducts(formData);
  };

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

      <ProductImportCenter
        selectedFile={selectedFile}
        onFileUpload={handleFileUpload}
        onImport={handleImport}
        isUploading={isPending}
      />

      {(isPending || stats.status) && (
        <ImportProcessingDashboard
          fileName={selectedFile?.name || ''}
          totalProducts={stats.totalProducts}
          imported={stats.imported}
          failed={stats.failed}
          duplicates={stats.duplicates}
          status={stats.status as any}
        />
      )}

      <ImportHistory />
      <ProductList />
    </div>
  );
}
