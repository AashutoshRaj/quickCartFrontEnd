import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center p-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center max-w-md">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2" style={{ fontWeight: 600 }}>404</p>
        <h1 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>Page not found</h1>
        <p className="text-sm text-gray-500 mt-2">The admin route you opened does not exist.</p>
        <Link
          to="/admin/dashboard"
          className="inline-flex mt-6 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
