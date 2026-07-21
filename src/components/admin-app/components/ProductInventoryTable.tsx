import { Edit, Trash2, Eye, Package, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ProductInventoryTableProps {
  filters: any;
}

const mockProducts = [
  {
    id: 1,
    image: '📱',
    name: 'iPhone 15 Pro Max',
    barcode: '8490213340',
    category: 'Electronics',
    price: 1299.99,
    stock: 142,
    inventoryValue: 184598.58,
    lastUpdated: 'Jun 13, 2026',
    status: 'in-stock'
  },
  {
    id: 2,
    image: '⌚',
    name: 'Apple Watch Series 9',
    barcode: '1092837465',
    category: 'Electronics',
    price: 429.00,
    stock: 8,
    inventoryValue: 3432.00,
    lastUpdated: 'Jun 12, 2026',
    status: 'low-stock'
  },
  {
    id: 3,
    image: '🎧',
    name: 'Sony WH-1000XM5',
    barcode: '5543210987',
    category: 'Electronics',
    price: 399.99,
    stock: 56,
    inventoryValue: 22399.44,
    lastUpdated: 'Jun 11, 2026',
    status: 'in-stock'
  },
  {
    id: 4,
    image: '👟',
    name: 'Nike Air Max 2026',
    barcode: '9908877665',
    category: 'Footwear',
    price: 189.99,
    stock: 0,
    inventoryValue: 0.00,
    lastUpdated: 'Jun 10, 2026',
    status: 'out-of-stock'
  },
  {
    id: 5,
    image: '💼',
    name: 'Leather Messenger Bag',
    barcode: '2233445566',
    category: 'Accessories',
    price: 149.99,
    stock: 210,
    inventoryValue: 31498.90,
    lastUpdated: 'Jun 13, 2026',
    status: 'in-stock'
  },
  {
    id: 6,
    image: '📷',
    name: 'Canon EOS R6',
    barcode: '7788990011',
    category: 'Electronics',
    price: 2499.00,
    stock: 24,
    inventoryValue: 59976.00,
    lastUpdated: 'Jun 12, 2026',
    status: 'in-stock'
  },
  {
    id: 7,
    image: '🎮',
    name: 'PlayStation 5 Pro',
    barcode: '4455667788',
    category: 'Electronics',
    price: 599.99,
    stock: 6,
    inventoryValue: 3599.94,
    lastUpdated: 'Jun 11, 2026',
    status: 'low-stock'
  },
  {
    id: 8,
    image: '🧥',
    name: 'Winter Parka Jacket',
    barcode: '1122334455',
    category: 'Fashion',
    price: 249.99,
    stock: 85,
    inventoryValue: 21249.15,
    lastUpdated: 'Jun 13, 2026',
    status: 'in-stock'
  }
];

const statusStyles = {
  'in-stock': 'bg-green-100 text-green-700 border-green-200',
  'low-stock': 'bg-orange-100 text-orange-700 border-orange-200',
  'out-of-stock': 'bg-red-100 text-red-700 border-red-200'
};

export function ProductInventoryTable({ filters }: ProductInventoryTableProps) {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(mockProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id: number) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Product Inventory Table</h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing 1-10 of 52,843 products
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
                  checked={selectedProducts.length === mockProducts.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Barcode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Qty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inventory Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockProducts.map((product) => (
              <tr
                key={product.id}
                className={`hover:bg-gray-50 transition-colors ${
                  selectedProducts.includes(product.id) ? 'bg-green-50' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                      {product.image}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                  {product.barcode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {product.stock} <span className="text-gray-500 font-normal">units</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${product.inventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {product.lastUpdated}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[product.status as keyof typeof statusStyles]}`}>
                    {product.status === 'in-stock' ? 'In Stock' : product.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                  </span>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing 1-8 of 52,843 products
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-2 text-gray-600 hover:bg-white rounded-lg transition-colors border border-gray-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3, '...', 48].map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={page === '...'}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-green-600 text-white'
                    : page === '...'
                    ? 'text-gray-400 cursor-default'
                    : 'text-gray-700 hover:bg-white border border-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 text-gray-600 hover:bg-white rounded-lg transition-colors border border-gray-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
