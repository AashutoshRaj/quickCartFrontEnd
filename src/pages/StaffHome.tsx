import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { QrCode, Clock, CheckCircle2, User, Loader2 } from 'lucide-react';
import { PATHS } from '../app/paths';
import { getStaffDashboardStats, type StaffDashboardStats } from '../api/staffVerificationApi';
import type { RootState } from '../types/index';
import { formatCurrency } from '../utils/currency.ts';
import { useStoreProfile } from '../hooks/useStoreProfile.ts';

/**
 * Security Dashboard (Staff Home)
 * Landing screen after Security Guard login — stats + recent activity +
 * primary "Scan Customer Exit QR" action.
 */
const StaffHome: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const { staffUser } = useSelector((state: RootState) => state.staffAuth);
  const [stats, setStats] = useState<StaffDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStaffDashboardStats()
      .then(setStats)
      .catch((err) => console.error('Failed to load dashboard stats:', err))
      .finally(() => setLoading(false));
  }, []);

  if (!staffUser) return <></>;

  // const currency = useSelector((state: RootState) => state.store.activeStore?.currency || 'USD');
  // console.log('StaffHome: stats:', currency);

  const { data: storeProfile } = useStoreProfile();
  const currency = storeProfile?.currency || 'INR';

  console.log("setcurrency", currency);
  return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-secondary font-inter text-xs">Welcome back</p>
            <h1 className="text-on-surface font-poppins font-bold text-xl">
              {staffUser.firstName} {staffUser.lastName}
            </h1>
            <p className="text-secondary font-inter text-xs">{stats?.storeName || staffUser.storeName}</p>
          </div>
          <button
            onClick={() => navigate(PATHS.STAFF_PROFILE)}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
          >
            <User className="w-5 h-5 text-primary" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl border border-outline/10 shadow-sm p-4">
              <p className="text-secondary font-inter text-xs">Verified Today</p>
              <p className="text-on-surface font-poppins font-bold text-2xl mt-1">
                {stats?.todayVerifications ?? 0}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-outline/10 shadow-sm p-4">
              <p className="text-secondary font-inter text-xs">Shift</p>
              <p className="text-on-surface font-poppins font-bold text-lg mt-1">{stats?.shift || '—'}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate(PATHS.STAFF_SCAN)}
          className="w-full bg-primary flex items-center justify-center gap-3 py-5 rounded-2xl shadow-xl shadow-primary/20 text-white font-poppins font-bold text-lg hover:bg-primary/90 transition-all"
        >
          <QrCode className="w-5 h-5" />
          Scan Customer Exit QR
        </button>

        <div>
          <p className="text-on-surface font-poppins font-semibold text-sm mb-2">Recent Activity</p>
          <div className="bg-white rounded-2xl border border-outline/10 shadow-sm divide-y divide-outline/5">
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-on-surface font-inter font-semibold truncate">
                      #{activity.orderNumber} · {activity.customerName}
                    </p>
                    <p className="text-xs text-secondary font-inter flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(activity.verifiedAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <p className="text-sm text-on-surface font-inter font-semibold">
                    {formatCurrency(activity.totalAmount, currency)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-secondary font-inter text-sm p-4 text-center">No verifications yet today.</p>
            )}
          </div>
        </div>
      </motion.div>
    
  );
};

export default StaffHome;
