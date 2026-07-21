import { Search, Filter, RotateCcw, Download } from 'lucide-react';

interface InventorySearchProps {
  filters: {
    productName: string;
    barcode: string;
    category: string;
    stockStatus: string;
    priceRange: { min: string; max: string };
  };
  onFiltersChange: (filters: any) => void;
}

export function InventorySearch({ filters, onFiltersChange }: InventorySearchProps) {
  const handleFilterChange = (field: string, value: string) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
    onFiltersChange({
      ...filters,
      priceRange: { ...filters.priceRange, [type]: value }
    });
  };

  const handleReset = () => {
    onFiltersChange({
      productName: '',
      barcode: '',
      category: '',
      stockStatus: '',
      priceRange: { min: '', max: '' }
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Inventory Search & Management</h2>
          <p className="text-sm text-gray-600 mt-1">Advanced search and filtering for inventory management</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-300"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export Results
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filters.productName}
              onChange={(e) => handleFilterChange('productName', e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Barcode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Barcode
          </label>
          <input
            type="text"
            value={filters.barcode}
            onChange={(e) => handleFilterChange('barcode', e.target.value)}
            placeholder="Enter barcode..."
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="footwear">Footwear</option>
            <option value="accessories">Accessories</option>
            <option value="grocery">Grocery</option>
            <option value="fashion">Fashion</option>
            <option value="home-decor">Home Decor</option>
          </select>
        </div>

        {/* Stock Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Status
          </label>
          <select
            value={filters.stockStatus}
            onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={filters.priceRange.min}
              onChange={(e) => handlePriceRangeChange('min', e.target.value)}
              placeholder="Min"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="number"
              value={filters.priceRange.max}
              onChange={(e) => handlePriceRangeChange('max', e.target.value)}
              placeholder="Max"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="flex items-center gap-2 px-6 py-2.5 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-medium">
          <Search className="w-4 h-4" />
          Search Products
        </button>
      </div>
    </div>
  );
}
