import { Edit, Trash2, Eye, Package, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { useState } from 'react';
import { useProducts } from '../../../hooks/useProducts';

interface ProductInventoryTableProps {
  filters: any;
}

const statusStyles: Record<string, string> = {
  'in-stock': 'bg-green-100 text-green-700 border-green-200',
  'low-stock': 'bg-orange-100 text-orange-700 border-orange-200',
  'out-of-stock': 'bg-red-100 text-red-700 border-red-200'
};

const getStockStatus = (stock: number): keyof typeof statusStyles => {
  if (stock === 0) return 'out-of-stock';
  if (stock <= 10) return 'low-stock';
  return 'in-stock';
};

const getStatusLabel = (stock: number): string => {
  if (stock === 0) return 'Out of Stock';
  if (stock <= 10) return 'Low Stock';
  return 'In Stock';
};

export function ProductInventoryTable({ filters }: ProductInventoryTableProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = useProducts(currentPage, 10, filters?.productName || '', filters?.category || '', filters?.stockStatus || '');

  const products = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, pages: 1 };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(p => (p._id as any).toString()));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 flex items-center justify-center">
        <Loader className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-red-600">Error loading products: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Product Inventory Table</h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {(meta.page - 1) * meta.limit + 1}-{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} products
              {selectedProducts.length > 0 && (
                <span className="ml-2 text-green-600 font-medium">
                  • {selectedProducts.length} selected
                </span>
              )}
            </p>
          </div>
          {selectedProducts.length > 0 && (
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-300">
                Bulk Update Stock
              </button>
              <button className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                Bulk Export
              </button>
              <button className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                Bulk Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={products.length > 0 && selectedProducts.length === products.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU / Barcode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => {
              const productId = (product._id as any).toString();
              const inventoryValue = (product.stock || 0) * (product.price || 0);
              const status = getStockStatus(product.stock || 0);
              const statusLabel = getStatusLabel(product.stock || 0);

              return (
                <tr
                  key={productId}
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedProducts.includes(productId) ? 'bg-green-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(productId)}
                      onChange={() => handleSelectProduct(productId)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                        {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" /> : '📦'}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                    {product.sku || product.barcode || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${product.price?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {product.stock || 0} <span className="text-gray-500 font-normal">{product.unit || 'units'}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
                      {statusLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Update Stock">
                        <Package className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(meta.page - 1) * meta.limit + 1}-{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} products
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-600 hover:bg-white rounded-lg transition-colors border border-gray-300 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, meta.pages) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-white border border-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
            {meta.pages > 5 && <span className="text-gray-400">...</span>}
            <button
              onClick={() => setCurrentPage(prev => Math.min(meta.pages, prev + 1))}
              disabled={currentPage === meta.pages}
              className="p-2 text-gray-600 hover:bg-white rounded-lg transition-colors border border-gray-300 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
