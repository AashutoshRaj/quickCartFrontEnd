import {
  Upload,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { useState, useRef } from 'react';
import { useImportProducts } from '../../../admin-hooks/import/useImportProducts';

interface ImportResult {
  total: number;
  success: number;
  duplicates: number;
  failed: number;
  errors: Array<{
    row: number;
    field: string;
    value: unknown;
    error: string;
  }>;
  skipped: Array<{
    row: number;
    reason: string;
    data: unknown;
  }>;
}

export function ProductImportCenter() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: importProducts, isPending: isUploading } = useImportProducts();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      const supportedFormats = ['csv', 'xlsx', 'xls'];

      if (supportedFormats.includes(ext || '')) {
        setSelectedFile(file);
        setImportResult(null);
      } else {
        alert(`Unsupported file format. Please use: ${supportedFormats.join(', ').toUpperCase()}`);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setImportResult(null);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    importProducts(formData, {
      onSuccess: (response) => {
        setImportResult(response.data);
        setSelectedFile(null);
      },
    });
  };

  const downloadTemplate = () => {
    const template = 'name,barcode,sku,brand,price,costPrice,discountPrice,description,category,unit,tax,currency,image,stock,status\nProduct Name,1234567890,SKU-001,Brand Name,99.99,50.00,89.99,Product Description,Electronics,piece,10,USD,https://example.com/image.jpg,100,active';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-import-template.csv';
    a.click();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Product Import Center
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Upload CSV/Excel files with product data. Supports barcode, SKU, pricing, inventory, and more.
          </p>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-4 py-2 text-sm text-green-700 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200"
        >
          <Download className="w-4 h-4" />
          Download Template
        </button>
      </div>

      {!importResult ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!selectedFile ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div>
                <p className="text-gray-900 font-medium mb-1">
                  Drag and drop your file here
                </p>
                <p className="text-sm text-gray-500">or</p>
              </div>
              <button
                onClick={handleBrowseClick}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
              >
                Browse Files
              </button>
              <p className="text-xs text-gray-500">
                Supports CSV, Excel (.xlsx), and Excel 97-2003 (.xls) files up to 10 MB
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                <FileText className="w-8 h-8 text-green-600" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={handleBrowseClick}
                  disabled={isUploading}
                  className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 disabled:opacity-50"
                >
                  Choose Different File
                </button>
                <button
                  onClick={handleImport}
                  disabled={isUploading}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploading && <Loader className="w-4 h-4 animate-spin" />}
                  {isUploading ? 'Importing...' : 'Import Products'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-6 rounded-lg border-2 ${
            importResult.success > 0
              ? 'bg-green-50 border-green-200'
              : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-start gap-4">
              {importResult.success > 0 ? (
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Import Summary
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Records</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {importResult.total}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Successfully Imported</p>
                    <p className="text-2xl font-bold text-green-600">
                      {importResult.success}
                    </p>
                  </div>
                  {importResult.duplicates > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">Duplicates Skipped</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {importResult.duplicates}
                      </p>
                    </div>
                  )}
                  {importResult.failed > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">Failed Records</p>
                      <p className="text-2xl font-bold text-red-600">
                        {importResult.failed}
                      </p>
                    </div>
                  )}
                </div>

                {importResult.errors.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-orange-200">
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Validation Errors
                    </p>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {importResult.errors.slice(0, 5).map((error, idx) => (
                        <p key={idx} className="text-xs text-gray-700">
                          Row {error.row}, {error.field}: {error.error}
                        </p>
                      ))}
                      {importResult.errors.length > 5 && (
                        <p className="text-xs text-gray-600 font-medium">
                          +{importResult.errors.length - 5} more errors
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setImportResult(null);
              setSelectedFile(null);
            }}
            className="w-full px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
          >
            Import Another File
          </button>
        </div>
      )}
    </div>
  );
}