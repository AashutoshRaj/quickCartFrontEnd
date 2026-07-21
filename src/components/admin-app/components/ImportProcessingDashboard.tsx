import { CheckCircle2, Clock } from 'lucide-react';

interface ImportProcessingDashboardProps {
  fileName: string;
  totalProducts?: number;
  imported?: number;
  failed?: number;
  duplicates?: number;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
}

export function ImportProcessingDashboard({ fileName, totalProducts = 0, imported = 0, failed = 0, duplicates = 0, status = 'processing' }: ImportProcessingDashboardProps) {
  const progress = totalProducts > 0 ? Math.round((imported / totalProducts) * 100) : 0;
  const isComplete = status === 'completed';
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Import Processing Dashboard</h2>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Overall Progress</p>
          <p className="text-sm font-semibold text-green-600">{progress}%</p>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>



      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">File Name</p>
          <p className="text-sm font-semibold text-gray-900 truncate">{fileName}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-xs text-green-700 uppercase tracking-wide mb-1">Imported</p>
          <p className="text-2xl font-semibold text-green-900">{imported.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <p className="text-xs text-red-700 uppercase tracking-wide mb-1">Failed</p>
          <p className="text-2xl font-semibold text-red-900">{failed.toLocaleString()}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <p className="text-xs text-orange-700 uppercase tracking-wide mb-1">Duplicates</p>
          <p className="text-2xl font-semibold text-orange-900">{duplicates.toLocaleString()}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-xs text-blue-700 uppercase tracking-wide mb-1">Total</p>
          <p className="text-lg font-semibold text-blue-900">{totalProducts.toLocaleString()}</p>
        </div>
      </div>

      {/* Estimated Time */}
      {!isComplete && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">Estimated Completion Time</p>
              <p className="text-xs text-blue-700">Approximately {Math.ceil((100 - progress) / 10)} minutes remaining</p>
            </div>
          </div>
        </div>
      )}

      {isComplete && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-900">Import Completed Successfully</p>
                <p className="text-xs text-green-700">{imported.toLocaleString()} products imported • {duplicates.toLocaleString()} duplicates skipped • {failed.toLocaleString()} failed</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
              View Import Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
