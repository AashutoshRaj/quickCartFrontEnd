export function CategoriesPage() {
  const categories = [
    { name: 'Fresh Produce', products: 8420, image: 'Produce', revenue: '$58,400' },
    { name: 'Dairy & Eggs', products: 6240, image: 'Dairy', revenue: '$41,200' },
    { name: 'Meat & Seafood', products: 4180, image: 'Meat', revenue: '$36,800' },
    { name: 'Bakery', products: 3240, image: 'Bakery', revenue: '$28,100' },
    { name: 'Beverages', products: 5820, image: 'Drinks', revenue: '$32,400' },
    { name: 'Snacks', products: 9840, image: 'Snacks', revenue: '$24,600' },
    { name: 'Frozen Foods', products: 4200, image: 'Frozen', revenue: '$19,800' },
    { name: 'Grocery & Staples', products: 10660, image: 'Grocery', revenue: '$44,200' },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} product categories</p>
        </div>
        <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors">+ Add Category</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {categories.map(cat => (
          <div key={cat.name} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-green-50 text-green-700 flex items-center justify-center text-xs mb-3" style={{ fontWeight: 700 }}>
              {cat.image}
            </div>
            <h3 className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{cat.name}</h3>
            <p className="text-xs text-gray-400 mt-1">{cat.products.toLocaleString()} products</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{cat.revenue}</span>
              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded" style={{ fontWeight: 500 }}>Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
