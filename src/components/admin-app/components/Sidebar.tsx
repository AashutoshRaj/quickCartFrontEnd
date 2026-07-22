import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Zap } from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { adminNavigation } from '../../../admin-routes/RouteConstants';
import { useAuth } from '../../../admin-auth/AuthContext';
import { useStoreProfile } from '../../../hooks/useStoreProfile';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: storeProfile } = useStoreProfile();

  const getDefaultOpen = () => {
    const openSections: Record<string, boolean> = {};
    adminNavigation.forEach(item => {
      if (item.children) {
        const isChildActive = item.children.some(child => child.path === location.pathname);
        if (isChildActive || location.pathname.startsWith(`${item.path}/`)) {
          openSections[item.label] = true;
        }
      }
    });
    return openSections;
  };

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(getDefaultOpen);

  useEffect(() => {
    setOpenSections(current => ({ ...current, ...getDefaultOpen() }));
  }, [location.pathname]);

  const toggle = (label: string) => {
    setOpenSections(s => ({ ...s, [label]: !s[label] }));
  };

  const isParentActive = (item: (typeof adminNavigation)[number]) =>
    item.path === location.pathname || Boolean(item.children?.some(child => child.path === location.pathname));

  // Use store name from store profile
  const storeName = storeProfile?.name || 'Store Manager';

  // Generate initials from store name for avatar
  const storeInitials = storeName
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-52 bg-[#1e2432] text-white flex flex-col flex-shrink-0" style={{ minHeight: '100vh' }}>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-white text-sm leading-tight" style={{ fontWeight: 700 }}>QuickCart</h2>
            <p className="text-white/40 text-[9px] uppercase tracking-widest leading-tight">Admin Console</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {adminNavigation.map(item => {
          const active = isParentActive(item);
          const open = openSections[item.label];
          const Icon = item.icon;
          const firstChildPath = item.children?.[0]?.path;

          return (
            <div key={item.label}>
              <button
                onClick={() => {
                  if (item.children) {
                    toggle(item.label);
                    if (!open && firstChildPath) navigate(firstChildPath);
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs mb-0.5 transition-all ${
                  active && !item.children
                    ? 'bg-green-500 text-white'
                    : active
                    ? 'text-white bg-white/8'
                    : 'text-white/60 hover:text-white hover:bg-white/6'
                }`}
                style={{ fontWeight: active ? 500 : 400 }}
              >
                {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
                <span className="flex-1 text-left leading-tight">{item.label}</span>
                {item.children && (
                  open
                    ? <ChevronDown className="w-3 h-3 opacity-60" />
                    : <ChevronRight className="w-3 h-3 opacity-40" />
                )}
              </button>

              {/* Sub-items */}
              {item.children && open && (
                <div className="ml-3 mb-1 pl-3 border-l border-white/10 space-y-0.5">
                  {item.children.map(child => {
                    const ChildIcon = child.icon;
                    return (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) => `w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-all ${
                          isActive ? 'bg-green-500 text-white' : 'text-white/50 hover:text-white hover:bg-white/6'
                        }`}
                        style={({ isActive }) => ({ fontWeight: isActive ? 500 : 400 })}
                      >
                        {ChildIcon && <ChildIcon className="w-3 h-3 flex-shrink-0" />}
                        <span className="leading-tight">{child.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Store Info */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-2.5">
          {/* Store Logo or Avatar */}
          {storeProfile?.logo ? (
            <img
              src={storeProfile.logo}
              alt={storeName}
              className="w-7 h-7 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xs flex-shrink-0" style={{ fontWeight: 700 }}>
              {storeInitials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-white text-xs leading-tight truncate" style={{ fontWeight: 500 }}>{user?.name || 'Admin'}</p>
            <p className="text-white/40 text-[10px] leading-tight truncate">{storeName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
