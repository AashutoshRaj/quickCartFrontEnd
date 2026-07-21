import {
  Upload,
  FileText,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { useState, useRef } from 'react';

interface ProductImportCenterProps {
  onFileUpload: (file: File) => void;
  onImport: () => void;
  selectedFile: File | null;
  isUploading: boolean;
}

export function ProductImportCenter({
  onFileUpload,
  selectedFile,
  onImport,
  isUploading,
}: ProductImportCenterProps) {
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const handleDragOver = (
    e: React.DragEvent
  ) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (
    e: React.DragEvent
  ) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;

    if (files.length > 0) {
      const file = files[0];

      if (
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.csv')
      ) {
        onFileUpload(file);
      }
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Product Import Center
          </h2>

          <p className="text-sm text-gray-600 mt-1">
            Upload product inventory files
            containing barcode, product
            name, category, price, stock
            quantity and product details.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 text-sm text-green-700 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200">
          <Download className="w-4 h-4" />
          Download Sample Template
        </button>
      </div>

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
          accept=".xlsx,.csv"
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

              <p className="text-sm text-gray-500">
                or
              </p>
            </div>

            <button
              onClick={handleBrowseClick}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
            >
              Browse Files
            </button>

            <p className="text-xs text-gray-500">
              Supports Excel (.xlsx) and CSV
              (.csv) files
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
                  {(
                    selectedFile.size / 1024
                  ).toFixed(2)}{' '}
                  KB
                </p>
              </div>

              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleBrowseClick}
                className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300"
              >
                Choose Different File
              </button>

              <button
                onClick={onImport}
                disabled={isUploading}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
              >
                {isUploading
                  ? 'Importing...'
                  : 'Import Products'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}