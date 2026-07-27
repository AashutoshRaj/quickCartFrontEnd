import { Outlet } from 'react-router-dom';

export function AuthLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f8fd] text-[#0f172a]">
      <div className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8">
        {children ?? <Outlet />}
      </div>
    </div>
  );
}
