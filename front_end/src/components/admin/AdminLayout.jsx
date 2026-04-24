import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Tổng quan', icon: 'dashboard', end: true },
  { to: '/admin/products', label: 'Sản phẩm', icon: 'inventory_2' },
  { to: '/admin/categories', label: 'Danh mục', icon: 'category' },
  { to: '/admin/orders', label: 'Đơn hàng', icon: 'receipt_long' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface flex">
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-inverse-surface text-inverse-on-surface transform transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-6 py-8 border-b border-white/10">
          <Link to="/" className="font-headline text-xl tracking-[0.3em] text-white block">
            ATELIER
          </Link>
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-white/50 mt-1">
            Admin Console
          </p>
        </div>
        <nav className="px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 font-label text-sm tracking-wider transition-all ${
                  isActive
                    ? 'bg-white text-inverse-surface'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 font-label text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Về trang chủ
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="bg-surface border-b border-outline-variant/30 px-6 md:px-10 py-4 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-on-surface"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="font-headline text-xl md:text-2xl text-on-background hidden md:block">
            Bảng điều khiển
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-label text-[10px] uppercase tracking-widest text-secondary">
                Quản trị viên
              </p>
              <p className="font-body text-sm text-on-surface truncate max-w-[180px]">
                {user?.fullName}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <button
              onClick={handleLogout}
              className="text-on-surface-variant hover:text-error transition-colors"
              title="Đăng xuất"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
