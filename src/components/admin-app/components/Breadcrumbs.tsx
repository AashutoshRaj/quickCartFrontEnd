import { Link, useLocation } from 'react-router-dom';

export function Breadcrumbs() {
  const { pathname } = useLocation();

  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] !== 'admin') return null;

  const formatLabel = (str: string) => {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const crumbs = [
    { label: 'Admin', path: '/admin/dashboard' },
    ...parts.slice(1).map((part, i) => ({
      label: formatLabel(part),
      path: '/' + parts.slice(0, i + 2).join('/'),
    })),
  ];

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-2.5">
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <span key={`${crumb.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span className="text-gray-300">/</span>}
              {isLast ? (
                <span className="text-gray-900" style={{ fontWeight: 500 }}>{crumb.label}</span>
              ) : (
                <Link to={crumb.path || '/admin/dashboard'} className="hover:text-green-600 transition-colors">
                  {crumb.label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
}
