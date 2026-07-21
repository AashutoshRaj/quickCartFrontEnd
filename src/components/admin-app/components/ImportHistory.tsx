import { FileText, Download, Eye, RefreshCw, MoreVertical } from 'lucide-react';
import useImportHistory from '../../../admin-hooks/import/useImportHistory';

const statusStyles = {
  completed: 'bg-green-100 text-green-700 border-green-200',
  processing: 'bg-blue-100 text-blue-700 border-blue-200',
  failed: 'bg-red-100 text-red-700 border-red-200',
  cancelled: 'bg-gray-100 text-gray-700 border-gray-200'
};

export function ImportHistory() {
  const { data, isLoading, isError } = useImportHistory(1, 10);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Import History</h2>
            <p className="text-sm text-gray-600 mt-1">Track all previous product uploads and imports</p>
          </div>
          <button className="px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-300">
            View All History
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Count</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imported</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Failed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">Loading import history…</td>
              </tr>
            )}

            {isError && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-red-600">Failed to load import history</td>
              </tr>
            )}

            {data?.data?.length === 0 && !isLoading && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">No import records found</td>
              </tr>
            )}

            {data?.data?.map((item: any) => (
              <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{item.fileName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(item.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.uploadedBy?.name || '—'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{(item.productCount || 0).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{(item.imported || 0).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">{(item.failed || 0).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[item.status as keyof typeof statusStyles]}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Download Report">
                      <Download className="w-4 h-4" />
                    </button>
                    {item.status === 'failed' && (
                      <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Re-import">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600">Showing {data?.data?.length || 0} of {data?.meta?.total || 0} import records</p>
      </div>
    </div>
  );
}
