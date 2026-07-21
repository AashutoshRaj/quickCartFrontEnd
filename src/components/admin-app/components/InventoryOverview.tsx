import { Package, CheckCircle, AlertCircle, FolderTree, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const kpiData = [
  {
    icon: Package,
    label: 'Total Products',
    value: '52,843',
    trend: '+2.4%',
    trendUp: true,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  {
    icon: CheckCircle,
    label: 'Active Products',
    value: '51,598',
    trend: '+1.8%',
    trendUp: true,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600'
  },
  {
    icon: AlertCircle,
    label: 'Out Of Stock',
    value: '312',
    trend: '-0.5%',
    trendUp: false,
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600'
  },
  {
    icon: FolderTree,
    label: 'Categories',
    value: '1,245',
    trend: '+12',
    trendUp: true,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600'
  },
  {
    icon: Calendar,
    label: 'Last Import Date',
    value: 'Jun 11, 2026',
    trend: '2 days ago',
    trendUp: null,
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600'
  },
  {
    icon: DollarSign,
    label: 'Inventory Value',
    value: '$2.8M',
    trend: '+8.2%',
    trendUp: true,
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600'
  }
];

export function InventoryOverview() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`${kpi.bgColor} p-2.5 rounded-lg`}>
                <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
              </div>
              {kpi.trendUp !== null && (
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  kpi.trendUp ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpi.trendUp ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{kpi.trend}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{kpi.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{kpi.value}</p>
            {kpi.trendUp === null && (
              <p className="text-xs text-gray-500 mt-1">{kpi.trend}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
