import { useState } from 'react';
import {
  Search,
  Plus,
  Check,
  X,
  Shield,
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
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from './ui/sheet';
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
import { Switch } from './ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useStoreProfile } from '../../../hooks/useStoreProfile';
import {
  useEmployees,
  useCreateEmployee,
  useSetEmployeeStatus,
  useResetEmployeePassword,
  useDeleteEmployee,
  useSendEmployeeCredentials,
} from '../../../hooks/useEmployees';
import type { Employee, EmployeeRole } from '../../../api/employeeApi';

const roleColors: Record<string, string> = {
  Admin: 'bg-purple-50 text-purple-700',
  Manager: 'bg-blue-50 text-blue-700',
  Cashier: 'bg-green-50 text-green-700',
  'Inventory Staff': 'bg-orange-50 text-orange-700',
};

const statusColors: Record<string, string> = {
  Active: 'bg-green-50 text-green-700',
  'On Leave': 'bg-yellow-50 text-yellow-700',
  Inactive: 'bg-gray-100 text-gray-500',
};

type Permission = 'View' | 'Create' | 'Edit' | 'Delete' | 'Export';
type Role = 'Admin' | 'Manager' | 'Cashier' | 'Inventory Staff';

const permissions: { module: string; roles: Record<Role, Permission[]> }[] = [
  { module: 'Dashboard', roles: { Admin: ['View'], Manager: ['View'], Cashier: ['View'], 'Inventory Staff': ['View'] } },
  { module: 'Orders', roles: { Admin: ['View', 'Create', 'Edit', 'Delete', 'Export'], Manager: ['View', 'Create', 'Edit', 'Export'], Cashier: ['View', 'Create'], 'Inventory Staff': ['View'] } },
  { module: 'Inventory', roles: { Admin: ['View', 'Create', 'Edit', 'Delete', 'Export'], Manager: ['View', 'Create', 'Edit', 'Export'], Cashier: ['View'], 'Inventory Staff': ['View', 'Create', 'Edit', 'Export'] } },
  { module: 'Customers', roles: { Admin: ['View', 'Create', 'Edit', 'Delete', 'Export'], Manager: ['View', 'Create', 'Edit', 'Export'], Cashier: ['View'], 'Inventory Staff': [] } },
  { module: 'Analytics', roles: { Admin: ['View', 'Export'], Manager: ['View', 'Export'], Cashier: [], 'Inventory Staff': [] } },
  { module: 'Offers', roles: { Admin: ['View', 'Create', 'Edit', 'Delete'], Manager: ['View', 'Create', 'Edit'], Cashier: ['View'], 'Inventory Staff': ['View'] } },
  { module: 'Staff', roles: { Admin: ['View', 'Create', 'Edit', 'Delete'], Manager: ['View'], Cashier: [], 'Inventory Staff': [] } },
  { module: 'Settings', roles: { Admin: ['View', 'Edit'], Manager: [], Cashier: [], 'Inventory Staff': [] } },
];

const allPerms: Permission[] = ['View', 'Create', 'Edit', 'Delete', 'Export'];
const roles: Role[] = ['Admin', 'Manager', 'Cashier', 'Inventory Staff'];

const activityLogs = [
  { emp: 'Sofia Ramirez', action: 'Approved bulk stock update — 200 items restocked', time: '09:38', date: 'Today' },
  { emp: 'Marcus Lee', action: 'Processed order ORD-8821 — $142.30', time: '09:42', date: 'Today' },
  { emp: 'Kevin Torres', action: 'Updated stock for Atlantic Salmon Fillet (+200 units)', time: '09:15', date: 'Today' },
  { emp: 'Aisha Bello', action: 'Refunded order ORD-8814 — $302.80', time: '08:52', date: 'Today' },
  { emp: 'Emma Wilson', action: 'Created promotion "Summer Fresh Savings"', time: '08:20', date: 'Today' },
  { emp: 'Rosa Martinez', action: 'Processed 18 transactions at Lane 5', time: '08:00', date: 'Today' },
];

interface CredentialsPanel {
  employeeName: string;
  employeeId: string;
  phone: string;
  tempPassword: string;
  storeName: string;
  role: string;
  employeeDbId: string;
}

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

const emptyForm = {
  firstName: '',
  lastName: '',
  role: 'Cashier' as EmployeeRole,
  email: '',
  phone: '',
  joiningDate: new Date().toISOString().slice(0, 10),
  status: 'Active' as 'Active' | 'Inactive',
};

export function StaffPage() {
  const [tab, setTab] = useState<'employees' | 'permissions' | 'logs'>('employees');
  const [search, setSearch] = useState('');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [credentials, setCredentials] = useState<CredentialsPanel | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: 'disable' | 'delete'; employee: Employee } | null>(null);

  const { data: storeProfile } = useStoreProfile();
  const { data, isLoading } = useEmployees({ search: search || undefined });
  const employees = data?.employees || [];

  const createEmployeeMutation = useCreateEmployee();
  const setStatus = useSetEmployeeStatus();
  const resetPassword = useResetEmployeePassword();
  const deleteEmployeeMutation = useDeleteEmployee();
  const sendCredentials = useSendEmployeeCredentials();

  const resetForm = () => setForm(emptyForm);

  const handleCreate = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    createEmployeeMutation.mutate(form, {
      onSuccess: ({ employee, tempPassword }) => {
        setIsAddOpen(false);
        resetForm();
        setCredentials({
          employeeName: `${employee.firstName} ${employee.lastName}`,
          employeeId: employee.employeeId,
          phone: employee.phone,
          tempPassword,
          storeName: storeProfile?.name || employee.storeId,
          role: employee.role,
          employeeDbId: employee._id,
        });
        toast.success('Employee Created Successfully');
      },
      onError: () => toast.error('Unable to Create Employee'),
    });
  };

  const handleToggleStatus = (employee: Employee) => {
    setStatus.mutate(
      { id: employee._id, status: employee.status === 'Active' ? 'Inactive' : 'Active' },
      {
        onSuccess: (updated) => toast.success(updated.status === 'Active' ? 'Employee Enabled' : 'Employee Disabled'),
        onError: () => toast.error('Unable to update employee status'),
      }
    );
    setConfirmAction(null);
  };

  const handleResetPassword = (employee: Employee) => {
    resetPassword.mutate(employee._id, {
      onSuccess: ({ tempPassword }) => {
        setCredentials({
          employeeName: `${employee.firstName} ${employee.lastName}`,
          employeeId: employee.employeeId,
          phone: employee.phone,
          tempPassword,
          storeName: storeProfile?.name || employee.storeId,
          role: employee.role,
          employeeDbId: employee._id,
        });
        toast.success('Password Reset Successfully');
      },
      onError: () => toast.error('Unable to reset password'),
    });
  };

  const handleDelete = (employee: Employee) => {
    deleteEmployeeMutation.mutate(employee._id, {
      onSuccess: () => toast.success('Employee deleted'),
      onError: () => toast.error('Unable to delete employee'),
    });
    setConfirmAction(null);
  };

  const handleSend = (method: 'email' | 'sms') => {
    if (!credentials) return;
    sendCredentials.mutate(
      { id: credentials.employeeDbId, method, tempPassword: credentials.tempPassword },
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
      `Phone Number: ${credentials.phone}`,
      `Temporary Password: ${credentials.tempPassword}`,
      `Store: ${credentials.storeName}`,
      `Role: ${credentials.role}`,
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
        <head><title>Employee Credentials</title></head>
        <body style="font-family: sans-serif; padding: 24px;">
          <h2>QuickCart Staff Account Credentials</h2>
          <p><strong>Name:</strong> ${credentials.employeeName}</p>
          <p><strong>Employee ID:</strong> ${credentials.employeeId}</p>
          <p><strong>Phone Number:</strong> ${credentials.phone}</p>
          <p><strong>Temporary Password:</strong> ${credentials.tempPassword}</p>
          <p><strong>Store:</strong> ${credentials.storeName}</p>
          <p><strong>Role:</strong> ${credentials.role}</p>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>Staff Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {employees.length} employees · {employees.filter((e) => e.status === 'Active').length} active now
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(['employees', 'permissions', 'logs'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm capitalize border-b-2 transition-colors ${tab === t ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            style={{ fontWeight: tab === t ? 500 : 400 }}
          >
            {t === 'logs' ? 'Activity Logs' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Employees tab */}
      {tab === 'employees' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employees..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
              />
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Employee', 'Role', 'Contact', 'Status', 'Joined', 'Last Active', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">Loading employees...</td>
                </tr>
              )}
              {!isLoading && employees.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">No employees found.</td>
                </tr>
              )}
              {employees.map((emp) => (
                <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
                        {initials(emp.firstName, emp.lastName)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{emp.firstName} {emp.lastName}</p>
                        <p className="text-xs text-gray-400">{emp.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-xs ${roleColors[emp.role]}`} style={{ fontWeight: 500 }}>{emp.role}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-gray-700">{emp.email}</p>
                    <p className="text-xs text-gray-400">{emp.phone}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-xs ${statusColors[emp.status]}`} style={{ fontWeight: 500 }}>{emp.status}</span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">{new Date(emp.joiningDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</td>
                  <td className="px-4 py-3.5 text-xs text-gray-400">{timeAgo(emp.lastLogin)}</td>
                  <td className="px-4 py-3.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.info('Employee profile page coming soon')}>
                          <Eye className="w-4 h-4 mr-2" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info('Edit employee coming soon')}>
                          <Pencil className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResetPassword(emp)}>
                          <KeyRound className="w-4 h-4 mr-2" /> Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setConfirmAction({ type: 'disable', employee: emp })}>
                          {emp.status === 'Active' ? (
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
                        <DropdownMenuItem onClick={() => setConfirmAction({ type: 'delete', employee: emp })} className="text-red-600 focus:text-red-600">
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
      )}

      {/* Permissions tab */}
      {tab === 'permissions' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-500" />
            <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Role Permissions Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-5 py-3 text-left text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 500 }}>Module</th>
                  {roles.map((role) => (
                    <th key={role} className="px-4 py-3 text-center" colSpan={5}>
                      <span className={`px-2.5 py-1 rounded text-xs ${roleColors[role]}`} style={{ fontWeight: 500 }}>{role}</span>
                    </th>
                  ))}
                </tr>
                <tr className="bg-gray-50 border-t border-gray-100">
                  <th className="px-5 py-2"></th>
                  {roles.map((role) => allPerms.map((p) => (
                    <th key={`${role}-${p}`} className="px-2 py-2 text-center text-xs text-gray-400">{p}</th>
                  )))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {permissions.map(({ module, roles: rolePerms }) => (
                  <tr key={module} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-800" style={{ fontWeight: 500 }}>{module}</td>
                    {roles.map((role) => allPerms.map((perm) => (
                      <td key={`${role}-${perm}`} className="px-2 py-3 text-center">
                        {rolePerms[role].includes(perm)
                          ? <Check className="w-3.5 h-3.5 text-green-500 mx-auto" />
                          : <X className="w-3.5 h-3.5 text-gray-200 mx-auto" />
                        }
                      </td>
                    )))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity Logs */}
      {tab === 'logs' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Activity Logs</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {activityLogs.map((log, i) => (
              <div key={i} className="px-5 py-4 hover:bg-gray-50 transition-colors flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs flex-shrink-0" style={{ fontWeight: 600 }}>
                  {log.emp.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-900" style={{ fontWeight: 500 }}>{log.emp}</span>
                  <span className="text-sm text-gray-600"> {log.action}</span>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{log.date}, {log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Employee Sheet */}
      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add Employee</SheetTitle>
          </SheetHeader>

          <div className="px-4 space-y-6 pb-4">
            <div className="space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Personal Information</p>
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
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email Address"
                type="email"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone Number"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
              />
              <p className="text-xs text-gray-400">A temporary password is generated automatically and shown after creation.</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Role & Store</p>
              <div className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-100 bg-gray-50 rounded-lg text-gray-600">
                <Building2 className="w-4 h-4 text-gray-400" />
                {storeProfile?.name || 'Loading store...'}
              </div>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as EmployeeRole })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Cashier">Cashier</option>
                <option value="Inventory Staff">Inventory Staff</option>
              </select>
              <input
                type="date"
                value={form.joiningDate}
                onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Account Status</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{form.status}</span>
                <Switch
                  checked={form.status === 'Active'}
                  onCheckedChange={(checked) => setForm({ ...form, status: checked ? 'Active' : 'Inactive' })}
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
              disabled={createEmployeeMutation.isPending}
              className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-60"
            >
              {createEmployeeMutation.isPending ? 'Creating...' : 'Create Employee'}
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
              Employee Created Successfully
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
                  <span className="text-gray-900" style={{ fontWeight: 500 }}>{credentials.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Temporary Password</span>
                  <span className="text-gray-900 font-mono" style={{ fontWeight: 500 }}>{credentials.tempPassword}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Store</span>
                  <span className="text-gray-900" style={{ fontWeight: 500 }}>{credentials.storeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Role</span>
                  <span className="text-gray-900" style={{ fontWeight: 500 }}>{credentials.role}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={handleCopy} className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  <Copy className="w-4 h-4" /> Copy Credentials
                </button>
                <button onClick={handlePrint} className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
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
                ? 'Delete Employee'
                : confirmAction?.employee.status === 'Active'
                ? 'Disable Employee Account'
                : 'Enable Employee Account'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === 'delete'
                ? `This permanently deletes ${confirmAction.employee.firstName} ${confirmAction.employee.lastName}'s account and cannot be undone.`
                : `This will ${confirmAction?.employee.status === 'Active' ? 'disable' : 'enable'} ${confirmAction?.employee.firstName} ${confirmAction?.employee.lastName}'s login access.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!confirmAction) return;
                if (confirmAction.type === 'delete') handleDelete(confirmAction.employee);
                else handleToggleStatus(confirmAction.employee);
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
