import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Bộ Sưu Tập', path: '/collections' },
    { name: 'Tìm Kiếm', path: '/search' },
    { name: 'Đơn Hàng', path: '/orders' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-stone-50/80 backdrop-blur-2xl">
      <div className="flex justify-between items-center w-full px-6 md:px-8 py-5 md:py-6 max-w-[1920px] mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            to="/"
            className="font-headline text-xl md:text-2xl tracking-[0.2em] font-medium text-neutral-800"
          >
            ATELIER
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-headline tracking-widest uppercase text-sm font-light transition-colors duration-300 ${
                isActive(link.path)
                  ? 'text-neutral-900 border-b border-neutral-800 pb-1'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-5">
          {/* Search */}
          <button
            onClick={() => navigate('/search')}
            className="hover:opacity-70 transition-opacity duration-500 text-neutral-700"
          >
            <span className="material-symbols-outlined">search</span>
          </button>

          {/* Cart */}
          <button
            onClick={() => navigate('/cart')}
            className="hover:opacity-70 transition-opacity duration-500 text-neutral-700 relative"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[8px] bg-primary text-on-primary rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          {/* User */}
          <div className="relative">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setUserMenuOpen(!userMenuOpen);
                } else {
                  navigate('/login');
                }
              }}
              className="hover:opacity-70 transition-opacity duration-500 text-neutral-700"
            >
              <span className="material-symbols-outlined">person</span>
            </button>

            {/* User Dropdown */}
            {userMenuOpen && isAuthenticated && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-outline-variant/20 shadow-lg z-50 animate-scale-in">
                  <div className="px-5 py-4 border-b border-outline-variant/15">
                    <p className="font-label text-xs uppercase tracking-widest text-secondary">Xin chào</p>
                    <p className="font-body text-sm font-medium text-on-surface mt-1 truncate">{user?.fullName}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-5 py-3 text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
                    >
                      Đơn hàng của tôi
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-5 py-3 text-sm text-primary hover:bg-surface-container-low transition-colors border-t border-outline-variant/15"
                      >
                        <span className="material-symbols-outlined text-[18px]">shield_person</span>
                        Trang quản trị
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                        navigate('/');
                      }}
                      className="block w-full text-left px-5 py-3 text-sm text-error hover:bg-surface-container-low transition-colors"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden hover:opacity-70 transition-opacity text-neutral-700"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface/95 backdrop-blur-xl border-t border-outline-variant/10 animate-fade-in">
          <div className="px-8 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block font-headline tracking-widest uppercase text-sm font-light py-2 ${
                  isActive(link.path) ? 'text-neutral-900' : 'text-neutral-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-headline tracking-widest uppercase text-sm font-light py-2 text-neutral-500"
              >
                Đăng Nhập
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
