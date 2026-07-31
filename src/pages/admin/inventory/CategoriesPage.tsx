import { Package, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProductCategories } from '../../../hooks/useProducts';

export function CategoriesPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useProductCategories();
  const categories = data?.data.categories ?? [];

  console.log('Categories data:', data);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>Categories</h1>
        <p className="text-sm text-gray-500 mt-0.5">{categories.length} product categories in this store</p>
      </div>
        <button
          onClick={() => navigate('/admin/inventory/products')}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
        >
          Add Category Through Product
        </button>
      </div>
      {isLoading && <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-500">Loading categories...</div>}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-sm text-red-700">{(error as Error).message}</p>
          <button onClick={() => refetch()} className="mt-3 inline-flex items-center gap-2 px-3 py-2 bg-white border border-red-200 rounded-lg text-sm text-red-700">
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
        </div>
      )}
      {!isLoading && !isError && categories.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-700 font-medium">No categories yet</p>
          <p className="text-sm text-gray-500 mt-1">Add a product with a category to create the first category.</p>
        </div>
      )}
      {!isLoading && !isError && categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/admin/inventory/products?category=${encodeURIComponent(cat.name)}`)}
              className="text-left bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-green-50 text-green-700 flex items-center justify-center text-xs mb-3 font-bold">
                {cat.name.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="text-gray-800 text-sm font-semibold">{cat.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{cat.productCount.toLocaleString()} products</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-gray-900 font-semibold">{cat.inventoryUnits.toLocaleString()} Pieces</span>
                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded font-medium">{cat.activeProducts} active</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
