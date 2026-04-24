import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success('Đăng nhập thành công!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Editorial Image */}
      <div className="relative w-full h-[400px] md:h-screen md:w-1/2 lg:w-[55%] flex-shrink-0 bg-surface-variant overflow-hidden">
        <img
          alt="Editorial fashion"
          className="absolute inset-0 w-full h-full object-cover object-center grayscale-[20%]"
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80&auto=format&fit=crop"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-surface/20 to-transparent mix-blend-multiply" />
        <div className="absolute top-8 left-8 md:top-12 md:left-12">
          <Link to="/" className="font-headline italic text-2xl tracking-[0.2em] font-light text-white drop-shadow-md">
            ATELIER
          </Link>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center px-8 py-16 md:px-16 lg:px-24 bg-surface z-10">
        <div className="w-full max-w-md mx-auto flex flex-col gap-14">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <h1 className="font-headline text-4xl md:text-5xl text-primary tracking-tight">Đăng Nhập</h1>
            <p className="font-body text-secondary text-sm md:text-base leading-relaxed max-w-sm">
              Nhập thông tin đăng nhập để tiếp tục hành trình mua sắm tại ATELIER.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <div className="relative">
              <label className="block font-label text-xs tracking-widest uppercase text-secondary mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domain.com"
                required
                className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 text-on-surface font-body focus:ring-0 focus:border-primary transition-colors placeholder:text-outline-variant/50"
              />
            </div>

            <div className="relative flex flex-col gap-2">
              <label className="block font-label text-xs tracking-widest uppercase text-secondary" htmlFor="password">
                Mật Khẩu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 text-on-surface font-body focus:ring-0 focus:border-primary transition-colors"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-on-primary py-4 px-8 font-label text-xs tracking-[0.2em] uppercase hover:bg-primary-dim transition-colors duration-300 shadow-[0_20px_40px_-15px_rgba(47,52,48,0.1)] flex justify-center items-center gap-4 disabled:opacity-50"
              >
                <span>{loading ? 'Đang xử lý...' : 'Đăng Nhập'}</span>
                {!loading && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="pt-6 border-t border-outline-variant/20 flex flex-col items-center gap-4">
            <span className="font-body text-sm text-secondary">Chưa có tài khoản?</span>
            <Link
              to="/register"
              className="font-label text-xs tracking-widest uppercase text-primary underline underline-offset-8 hover:text-secondary transition-colors duration-300"
            >
              Đăng Ký Ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
