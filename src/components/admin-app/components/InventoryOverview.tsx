import { useQuery } from '@tanstack/react-query';
import { Package, CheckCircle, AlertCircle, FolderTree, Calendar, DollarSign } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useStoreProfile } from '../../../hooks/useStoreProfile';
import type { RootState } from '../../../types/index';
import { formatCurrency } from '../../../utils/currency';
import { getProductSummary } from '../../../api/products/productApi';

interface InventorySummary {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  categories: number;
  lastImportDate: string | null;
  inventoryValue: number;
}

interface InventoryOverviewResponse {
  status: string;
  data: InventorySummary;
}

const overviewItems = [
  {
    icon: Package,
    label: 'Total Products',
    field: 'totalProducts',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: CheckCircle,
    label: 'Active Products',
    field: 'activeProducts',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    icon: AlertCircle,
    label: 'Out Of Stock',
    field: 'outOfStock',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
  },
  {
    icon: FolderTree,
    label: 'Categories',
    field: 'categories',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: Calendar,
    label: 'Last Import Date',
    field: 'lastImportDate',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    isDate: true,
  },
  {
    icon: DollarSign,
    label: 'Inventory Value',
    field: 'inventoryValue',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    isCurrency: true,
  },
];

export function InventoryOverview() {
  const { data, isLoading } = useQuery<InventoryOverviewResponse>({
    queryKey: ['productSummary'],
    queryFn: getProductSummary,
    staleTime: 15000,
    refetchOnWindowFocus: true,
  });

  const summary = data?.data;
  const { data: storeProfile } = useStoreProfile();
  const currency = storeProfile?.currency || useSelector((state: RootState) => state.store.activeStore?.currency || 'USD');

  const formatValue = (item: typeof overviewItems[number]) => {
    const value = summary?.[item.field as keyof InventorySummary];

    if (value === undefined || value === null) {
      return isLoading ? 'Loading...' : '—';
    }

    if (item.isDate) {
      return value ? new Date(value as string).toLocaleDateString() : 'No imports';
    }

    if (item.isCurrency) {
      return formatCurrency(Number(value as number || 0), currency, undefined, 0);
    }

    return (value as number).toLocaleString();
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {overviewItems.map((item) => (
          <div key={item.label} className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`${item.bgColor} p-2.5 rounded-lg`}>
                <item.icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{item.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{formatValue(item)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
