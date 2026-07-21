import { Outlet } from 'react-router-dom';
import { Sidebar } from '../admin-app/components/Sidebar';
import { Header } from '../admin-app/components/Header';
import { Breadcrumbs } from '../admin-app/components/Breadcrumbs';

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-[#f5f6f8] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <Breadcrumbs />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
