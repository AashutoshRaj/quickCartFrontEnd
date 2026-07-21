import { useState } from 'react';
import { Search, Plus, Check, X, Eye, Shield } from 'lucide-react';

const employees = [
  { id: 'EMP-001', name: 'Sofia Ramirez', role: 'Manager', email: 'sofia.r@quickcart.com', phone: '+1 555-0201', status: 'Active', joined: 'Mar 2023', lastActive: '5 min ago' },
  { id: 'EMP-002', name: 'Marcus Lee', role: 'Cashier', email: 'marcus.l@quickcart.com', phone: '+1 555-0202', status: 'Active', joined: 'Jul 2023', lastActive: '2 min ago' },
  { id: 'EMP-003', name: 'Aisha Bello', role: 'Cashier', email: 'aisha.b@quickcart.com', phone: '+1 555-0203', status: 'Active', joined: 'Sep 2023', lastActive: '1 min ago' },
  { id: 'EMP-004', name: 'Kevin Torres', role: 'Inventory Staff', email: 'kevin.t@quickcart.com', phone: '+1 555-0204', status: 'Active', joined: 'Jan 2024', lastActive: '12 min ago' },
  { id: 'EMP-005', name: 'Rosa Martinez', role: 'Cashier', email: 'rosa.m@quickcart.com', phone: '+1 555-0205', status: 'Active', joined: 'Feb 2024', lastActive: '1 min ago' },
  { id: 'EMP-006', name: 'Daniel Park', role: 'Inventory Staff', email: 'daniel.p@quickcart.com', phone: '+1 555-0206', status: 'On Leave', joined: 'Nov 2023', lastActive: '3 days ago' },
  { id: 'EMP-007', name: 'Emma Wilson', role: 'Admin', email: 'emma.w@quickcart.com', phone: '+1 555-0207', status: 'Active', joined: 'Oct 2022', lastActive: '8 min ago' },
  { id: 'EMP-008', name: 'Lucas Brown', role: 'Cashier', email: 'lucas.b@quickcart.com', phone: '+1 555-0208', status: 'Inactive', joined: 'Apr 2024', lastActive: '2 weeks ago' },
];

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

export function StaffPage() {
  const [tab, setTab] = useState<'employees' | 'permissions' | 'logs'>('employees');
  const [search, setSearch] = useState('');

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>Staff Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">{employees.length} employees · {employees.filter(e => e.status === 'Active').length} active now</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(['employees', 'permissions', 'logs'] as const).map(t => (
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
                onChange={e => setSearch(e.target.value)}
                placeholder="Search employees..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
              />
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Employee', 'Role', 'Contact', 'Status', 'Joined', 'Last Active', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{emp.name}</p>
                        <p className="text-xs text-gray-400">{emp.id}</p>
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
                  <td className="px-4 py-3.5 text-xs text-gray-500">{emp.joined}</td>
                  <td className="px-4 py-3.5 text-xs text-gray-400">{emp.lastActive}</td>
                  <td className="px-4 py-3.5">
                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700 transition-colors"><Eye className="w-4 h-4" /></button>
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
                  {roles.map(role => (
                    <th key={role} className="px-4 py-3 text-center" colSpan={5}>
                      <span className={`px-2.5 py-1 rounded text-xs ${roleColors[role]}`} style={{ fontWeight: 500 }}>{role}</span>
                    </th>
                  ))}
                </tr>
                <tr className="bg-gray-50 border-t border-gray-100">
                  <th className="px-5 py-2"></th>
                  {roles.map(role => allPerms.map(p => (
                    <th key={`${role}-${p}`} className="px-2 py-2 text-center text-xs text-gray-400">{p}</th>
                  )))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {permissions.map(({ module, roles: rolePerms }) => (
                  <tr key={module} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-800" style={{ fontWeight: 500 }}>{module}</td>
                    {roles.map(role => allPerms.map(perm => (
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
                  {log.emp.split(' ').map(n => n[0]).join('')}
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
    </div>
  );
}
