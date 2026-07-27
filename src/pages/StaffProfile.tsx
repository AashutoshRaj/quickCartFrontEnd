import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldCheck, LogOut, Building2, Clock, IdCard, ArrowLeft, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { PATHS } from '../app/paths';
import { staffLogout } from '../store/slices/staffAuthSlice.ts';
import type { RootState } from '../types/index';

/**
 * Guard Profile Page
 * Read-only profile + logout. Change Password is a follow-up pass.
 */
const StaffProfile: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { staffUser } = useSelector((state: RootState) => state.staffAuth);

  const handleLogout = (): void => {
    navigate(PATHS.LOGIN, { replace: true });
    dispatch(staffLogout());
    toast.success('Logged out');
  };

  if (!staffUser) return <></>;

  return (
    <div className="h-dvh bg-background flex flex-col px-6 py-8">
      <button
        onClick={() => navigate(PATHS.STAFF_HOME)}
        className="flex items-center gap-2 text-secondary font-inter text-sm mb-6 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex justify-center">
          <div className="bg-primary p-5 rounded-[2rem] shadow-xl shadow-primary/20">
            <ShieldCheck size={40} className="text-white" strokeWidth={2.5} />
          </div>
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-on-surface font-poppins font-bold text-2xl">
            {staffUser.firstName} {staffUser.lastName}
          </h1>
          <p className="text-secondary font-inter text-sm">{staffUser.role}</p>
        </div>

        <div className="bg-white rounded-2xl border border-outline/10 shadow-sm divide-y divide-outline/5">
          <div className="flex items-center gap-3 p-4">
            <IdCard className="w-4 h-4 text-secondary" />
            <span className="text-sm text-on-surface font-inter">{staffUser.employeeId}</span>
          </div>
          <div className="flex items-center gap-3 p-4">
            <Building2 className="w-4 h-4 text-secondary" />
            <span className="text-sm text-on-surface font-inter">{staffUser.storeName}</span>
          </div>
          {staffUser.shift && (
            <div className="flex items-center gap-3 p-4">
              <Clock className="w-4 h-4 text-secondary" />
              <span className="text-sm text-on-surface font-inter">{staffUser.shift} Shift</span>
            </div>
          )}
        </div>

        <button
          onClick={() => toast.info('Change Password is coming in the next update')}
          className="w-full bg-white border border-outline/10 py-3 rounded-2xl text-on-surface font-poppins font-medium flex items-center justify-center gap-2 hover:bg-background transition-colors"
        >
          <KeyRound className="w-4 h-4" />
          Change Password
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-white border border-outline/10 py-3 rounded-2xl text-red-500 font-poppins font-medium flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </motion.div>
    </div>
  );
};

export default StaffProfile;
