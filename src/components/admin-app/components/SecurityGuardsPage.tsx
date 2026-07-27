import { useState } from 'react';
import {
  Plus,
  Search,
  Download,
  MoreVertical,
  Eye,
  Pencil,
  KeyRound,
  Ban,
  CheckCircle2,
  Trash2,
  Copy,
  Printer,
  Mail,
  MessageSquare,
  ShieldCheck,
  UserRound,
  Building2,
  Clock,
  QrCode,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from './ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from './ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Switch } from './ui/switch';
import { useStoreProfile } from '../../../hooks/useStoreProfile';
import {
  useSecurityGuards,
  useSecurityGuardStats,
  useCreateSecurityGuard,
  useToggleSecurityGuardStatus,
  useResetSecurityGuardPassword,
  useDeleteSecurityGuard,
  useSendSecurityGuardCredentials,
} from '../../../hooks/useSecurityGuards';
import type { SecurityGuard } from '../../../api/securityGuardApi';

type ShiftFilter = 'all' | 'Morning' | 'Afternoon' | 'Night';
type StatusFilter = 'all' | 'active' | 'inactive';
type SortOption = 'newest' | 'mostActive' | 'employeeId';

interface CredentialsPanel {
  guardName: string;
  employeeId: string;
  mobileNumber: string;
  tempPassword: string;
  storeName: string;
  shift: string;
  guardId: string;
  email: string;
}

const shiftColors: Record<string, string> = {
  Morning: 'bg-amber-50 text-amber-700',
  Afternoon: 'bg-blue-50 text-blue-700',
  Night: 'bg-indigo-50 text-indigo-700',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-50 text-green-700',
  inactive: 'bg-gray-100 text-gray-500',
};

const initials = (first: string, last: string) => `${first[0] || ''}${last[0] || ''}`.toUpperCase();

const timeAgo = (value?: string | null) => {
  if (!value) return 'Never';
  const diffMs = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const workflowSteps = [
  'Create Security Guard',
  'Assign Store',
  'Generate Login Credentials',
  'Share Credentials',
  'Security Guard Logs In',
  'Scan Customer Exit QR',
  'Verify Purchased Products',
  'Approve Customer Exit',
  'Verification Saved in System',
];

const emptyForm = {
  firstName: '',
  lastName: '',
  mobileNumber: '',
  email: '',
  shift: 'Morning' as 'Morning' | 'Afternoon' | 'Night',
  joiningDate: new Date().toISOString().slice(0, 10),
  employeeCode: '',
  status: 'active' as 'active' | 'inactive',
};

export function SecurityGuardsPage() {
  const [search, setSearch] = useState('');
  const [shiftFilter, setShiftFilter] = useState<ShiftFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<SortOption>('newest');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [credentials, setCredentials] = useState<CredentialsPanel | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: 'disable' | 'delete'; guard: SecurityGuard } | null>(
    null
  );

  const { data: storeProfile } = useStoreProfile();
  const { data: stats } = useSecurityGuardStats();
  const { data, isLoading } = useSecurityGuards({
    search: search || undefined,
    shift: shiftFilter === 'all' ? undefined : shiftFilter,
    status: statusFilter === 'all' ? undefined : statusFilter,
    sort,
  });

  const createGuard = useCreateSecurityGuard();
  const toggleStatus = useToggleSecurityGuardStatus();
  const resetPassword = useResetSecurityGuardPassword();
  const deleteGuard = useDeleteSecurityGuard();
  const sendCredentials = useSendSecurityGuardCredentials();

  const guards = data?.guards || [];

  const statCards = [
    { label: 'Total Guards', value: stats?.totalGuards ?? 0, icon: UserRound },
    { label: 'Active Guards', value: stats?.activeGuards ?? 0, icon: CheckCircle2 },
    { label: 'Guards On Shift', value: stats?.guardsOnShift ?? 0, icon: Clock },
    { label: "Today's QR Verifications", value: stats?.todayVerifications ?? 0, icon: QrCode },
    { label: 'Reported Issues', value: stats?.reportedIssues ?? 0, icon: AlertTriangle },
  ];

  const resetForm = () => setForm(emptyForm);

  const handleCreate = () => {
    if (!form.firstName || !form.lastName || !form.mobileNumber || !form.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    createGuard.mutate(form, {
      onSuccess: ({ guard, tempPassword }) => {
        setIsAddOpen(false);
        resetForm();
        setCredentials({
          guardName: `${guard.firstName} ${guard.lastName}`,
          employeeId: guard.employeeId,
          mobileNumber: guard.mobileNumber,
          tempPassword,
          storeName: storeProfile?.name || guard.storeId,
          shift: guard.shift,
          guardId: guard._id,
          email: guard.email,
        });
        toast.success('Security Guard Created Successfully');
      },
      onError: () => toast.error('Unable to Create Guard'),
    });
  };

  const handleToggleStatus = (guard: SecurityGuard) => {
    toggleStatus.mutate(guard._id, {
      onSuccess: (updated) =>
        toast.success(updated.status === 'active' ? 'Guard Account Enabled' : 'Guard Account Disabled'),
      onError: () => toast.error('Unable to update guard status'),
    });
    setConfirmAction(null);
  };

  const handleResetPassword = (guard: SecurityGuard) => {
    resetPassword.mutate(guard._id, {
      onSuccess: ({ tempPassword }) => {
        setCredentials({
          guardName: `${guard.firstName} ${guard.lastName}`,
          employeeId: guard.employeeId,
          mobileNumber: guard.mobileNumber,
          tempPassword,
          storeName: storeProfile?.name || guard.storeId,
          shift: guard.shift,
          guardId: guard._id,
          email: guard.email,
        });
        toast.success('Password Reset Successfully');
      },
      onError: () => toast.error('Unable to reset password'),
    });
  };

  const handleDelete = (guard: SecurityGuard) => {
    deleteGuard.mutate(guard._id, {
      onSuccess: () => toast.success('Security guard deleted'),
      onError: () => toast.error('Unable to delete guard'),
    });
    setConfirmAction(null);
  };

  const handleSend = (method: 'email' | 'sms') => {
    if (!credentials) return;
    sendCredentials.mutate(
      { id: credentials.guardId, method, tempPassword: credentials.tempPassword },
      {
        onSuccess: () => toast.success('Credentials Shared Successfully'),
        onError: () => toast.error(`Unable to send credentials via ${method}`),
      }
    );
  };

  const handleCopy = () => {
    if (!credentials) return;
    const text = [
      `Employee ID: ${credentials.employeeId}`,
      `Phone Number: ${credentials.mobileNumber}`,
      `Temporary Password: ${credentials.tempPassword}`,
      `Assigned Store: ${credentials.storeName}`,
      `Assigned Shift: ${credentials.shift}`,
    ].join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Credentials copied to clipboard');
  };

  const handlePrint = () => {
    if (!credentials) return;
    const win = window.open('', '_blank', 'width=480,height=600');
    if (!win) return;
    win.document.write(`
      <html>
        <head><title>Security Guard Credentials</title></head>
        <body style="font-family: sans-serif; padding: 24px;">
          <h2>QuickCart Security Guard Credentials</h2>
          <p><strong>Name:</strong> ${credentials.guardName}</p>
          <p><strong>Employee ID:</strong> ${credentials.employeeId}</p>
          <p><strong>Phone Number:</strong> ${credentials.mobileNumber}</p>
          <p><strong>Temporary Password:</strong> ${credentials.tempPassword}</p>
          <p><strong>Assigned Store:</strong> ${credentials.storeName}</p>
          <p><strong>Assigned Shift:</strong> ${credentials.shift}</p>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const handleExport = () => {
    const rows = [
      ['Employee ID', 'Full Name', 'Mobile Number', 'Email', 'Store', 'Shift', 'Status', 'Last Login', 'QR Verifications Today'],
      ...guards.map((g) => [
        g.employeeId,
        `${g.firstName} ${g.lastName}`,
        g.mobileNumber,
        g.email,
        storeProfile?.name || g.storeId,
        g.shift,
        g.status,
        g.lastLogin || '',
        String(g.todayVerifications),
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'security-guards.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>Security Guards</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {stats?.totalGuards ?? 0} guards · {stats?.activeGuards ?? 0} active
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export List
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Security Guard
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{card.label}</p>
              <card.icon className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl text-gray-900 mt-2" style={{ fontWeight: 600 }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="sticky top-0 z-10 bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, employee ID or phone..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
          />
        </div>
        <select
          value={shiftFilter}
          onChange={(e) => setShiftFilter(e.target.value as ShiftFilter)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
        >
          <option value="all">All Shifts</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Night">Night</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
        >
          <option value="newest">Newest</option>
          <option value="mostActive">Most Active</option>
          <option value="employeeId">Employee ID</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {['Guard', 'Employee ID', 'Mobile Number', 'Assigned Store', 'Shift', 'Status', 'Last Login', 'QR Verifications Today', ''].map(
                (h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 500 }}>
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-400 text-sm">
                  Loading security guards...
                </td>
              </tr>
            )}
            {!isLoading && guards.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-400 text-sm">
                  No security guards found.
                </td>
              </tr>
            )}
            {guards.map((guard) => (
              <tr key={guard._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white text-xs flex-shrink-0"
                      style={{ fontWeight: 600 }}
                    >
                      {initials(guard.firstName, guard.lastName)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>
                        {guard.firstName} {guard.lastName}
                      </p>
                      <p className="text-xs text-gray-400">{guard.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-xs text-gray-600">{guard.employeeId}</td>
                <td className="px-4 py-3.5 text-xs text-gray-600">{guard.mobileNumber}</td>
                <td className="px-4 py-3.5 text-xs text-gray-600">{storeProfile?.name || guard.storeId}</td>
                <td className="px-4 py-3.5">
                  <span className={`px-2 py-0.5 rounded text-xs ${shiftColors[guard.shift]}`} style={{ fontWeight: 500 }}>
                    {guard.shift}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`px-2 py-0.5 rounded text-xs ${statusColors[guard.status]}`} style={{ fontWeight: 500 }}>
                    {guard.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-xs text-gray-400">{timeAgo(guard.lastLogin)}</td>
                <td className="px-4 py-3.5 text-xs text-gray-600">{guard.todayVerifications}</td>
                <td className="px-4 py-3.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toast.info('Guard profile page coming soon')}>
                        <Eye className="w-4 h-4 mr-2" /> View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.info('Edit guard coming soon')}>
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleResetPassword(guard)}>
                        <KeyRound className="w-4 h-4 mr-2" /> Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setConfirmAction({ type: 'disable', guard })}>
                        {guard.status === 'active' ? (
                          <>
                            <Ban className="w-4 h-4 mr-2" /> Disable
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Enable
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setConfirmAction({ type: 'delete', guard })}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Workflow */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-gray-500" />
          <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Security Guard Workflow</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full" style={{ fontWeight: 500 }}>
            Admin
          </span>
          {workflowSteps.map((step) => (
            <span key={step} className="flex items-center gap-2">
              <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
              <span className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-100" style={{ fontWeight: 500 }}>
                {step}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Add Security Guard Sheet */}
      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add Security Guard</SheetTitle>
          </SheetHeader>

          <div className="px-4 space-y-6 pb-4">
            {/* Personal Information */}
            <div className="space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>
                Personal Information
              </p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="First Name"
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
                />
                <input
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Last Name"
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
                />
              </div>
              <input
                disabled
                value="Auto-generated on save"
                className="w-full px-3 py-2 text-sm border border-gray-100 bg-gray-50 text-gray-400 rounded-lg"
              />
              <input
                value={form.mobileNumber}
                onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                placeholder="Mobile Number"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
              />
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email Address"
                type="email"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
              />
              <p className="text-xs text-gray-400">A temporary password is generated automatically and shown after creation.</p>
            </div>

            {/* Store Assignment */}
            <div className="space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>
                Store Assignment
              </p>
              <div className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-100 bg-gray-50 rounded-lg text-gray-600">
                <Building2 className="w-4 h-4 text-gray-400" />
                {storeProfile?.name || 'Loading store...'}
              </div>
              <select
                value={form.shift}
                onChange={(e) => setForm({ ...form, shift: e.target.value as typeof form.shift })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Night">Night</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={form.joiningDate}
                  onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
                />
                <input
                  value={form.employeeCode}
                  onChange={(e) => setForm({ ...form, employeeCode: e.target.value })}
                  placeholder="Employee Code"
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
                />
              </div>
            </div>

            {/* Security Permissions */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>
                Security Permissions
              </p>
              <div className="grid grid-cols-1 gap-1.5 text-xs text-green-700">
                {['Login', 'Scan Customer Exit QR', 'View Order Details', 'Verify Exit', "View Today's Verification History", 'Report Security Issues'].map(
                  (perm) => (
                    <div key={perm} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {perm}
                    </div>
                  )
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                All other admin modules (Products, Inventory, Customers, Orders, Payments, Analytics, Reports, Settings, Employee
                Management) are disabled for this role.
              </p>
            </div>

            {/* Account Status */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>
                Account Status
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{form.status === 'active' ? 'Active' : 'Inactive'}</span>
                <Switch
                  checked={form.status === 'active'}
                  onCheckedChange={(checked) => setForm({ ...form, status: checked ? 'active' : 'inactive' })}
                />
              </div>
            </div>
          </div>

          <SheetFooter className="flex-row justify-end gap-2">
            <button
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={createGuard.isPending}
              className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-60"
            >
              {createGuard.isPending ? 'Creating...' : 'Create Security Guard'}
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Success / Credentials Dialog */}
      <Dialog open={!!credentials} onOpenChange={(open) => !open && setCredentials(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Security Guard Created Successfully
            </DialogTitle>
          </DialogHeader>

          {credentials && (
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg border border-gray-100 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Employee ID</span>
                  <span className="text-gray-900" style={{ fontWeight: 500 }}>{credentials.employeeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone Number</span>
                  <span className="text-gray-900" style={{ fontWeight: 500 }}>{credentials.mobileNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Temporary Password</span>
                  <span className="text-gray-900 font-mono" style={{ fontWeight: 500 }}>{credentials.tempPassword}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Assigned Store</span>
                  <span className="text-gray-900" style={{ fontWeight: 500 }}>{credentials.storeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Assigned Shift</span>
                  <span className="text-gray-900" style={{ fontWeight: 500 }}>{credentials.shift}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Copy className="w-4 h-4" /> Copy Credentials
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Printer className="w-4 h-4" /> Print Credentials
                </button>
                <button
                  onClick={() => handleSend('email')}
                  disabled={sendCredentials.isPending}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  <Mail className="w-4 h-4" /> Send via Email
                </button>
                <button
                  onClick={() => handleSend('sms')}
                  disabled={sendCredentials.isPending}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  <MessageSquare className="w-4 h-4" /> Send via SMS
                </button>
              </div>
            </div>
          )}

          <DialogFooter>
            <button
              onClick={() => setCredentials(null)}
              className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Done
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm disable / delete */}
      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === 'delete'
                ? 'Delete Security Guard'
                : confirmAction?.guard.status === 'active'
                ? 'Disable Guard Account'
                : 'Enable Guard Account'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === 'delete'
                ? `This permanently deletes ${confirmAction.guard.firstName} ${confirmAction.guard.lastName}'s account and cannot be undone.`
                : `This will ${confirmAction?.guard.status === 'active' ? 'disable' : 'enable'} ${confirmAction?.guard.firstName} ${confirmAction?.guard.lastName}'s login access.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!confirmAction) return;
                if (confirmAction.type === 'delete') handleDelete(confirmAction.guard);
                else handleToggleStatus(confirmAction.guard);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
