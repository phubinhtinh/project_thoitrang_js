import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SignUpPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Image */}
      <section className="hidden md:block md:w-1/2 relative bg-surface-variant overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-surface/20 backdrop-blur-[2px]" />
        <div className="absolute top-12 left-12">
          <Link to="/" className="font-headline italic text-2xl tracking-[0.2em] font-light text-white drop-shadow-md">
            ATELIER
          </Link>
        </div>
      </section>

      {/* Right: Form */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-surface relative z-10">
        <div className="w-full max-w-md space-y-10">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="font-headline italic text-4xl lg:text-5xl font-light tracking-wide text-primary">Đăng Ký</h1>
            <p className="font-body text-secondary text-sm md:text-base leading-relaxed max-w-sm">
              Tạo tài khoản để bắt đầu hành trình mua sắm tại ATELIER.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="relative">
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                placeholder="Họ và Tên"
                className="block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant text-on-surface font-body text-base focus:ring-0 focus:border-primary transition-colors peer placeholder-transparent"
                id="fullName"
              />
              <label
                htmlFor="fullName"
                className="absolute left-0 -top-3.5 text-secondary text-sm font-label transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-outline peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-secondary peer-focus:text-sm"
              >
                Họ và Tên
              </label>
            </div>

            <div className="relative">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className="block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant text-on-surface font-body text-base focus:ring-0 focus:border-primary transition-colors peer placeholder-transparent"
                id="signup-email"
              />
              <label
                htmlFor="signup-email"
                className="absolute left-0 -top-3.5 text-secondary text-sm font-label transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-outline peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-secondary peer-focus:text-sm"
              >
                Email
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Mật Khẩu"
                className="block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant text-on-surface font-body text-base focus:ring-0 focus:border-primary transition-colors peer placeholder-transparent"
                id="signup-password"
              />
              <label
                htmlFor="signup-password"
                className="absolute left-0 -top-3.5 text-secondary text-sm font-label transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-outline peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-secondary peer-focus:text-sm"
              >
                Mật Khẩu (tối thiểu 6 ký tự)
              </label>
            </div>

            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Số Điện Thoại"
                className="block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant text-on-surface font-body text-base focus:ring-0 focus:border-primary transition-colors peer placeholder-transparent"
                id="phone"
              />
              <label
                htmlFor="phone"
                className="absolute left-0 -top-3.5 text-secondary text-sm font-label transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-outline peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-secondary peer-focus:text-sm"
              >
                Số Điện Thoại (tùy chọn)
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 shadow-sm text-sm font-label font-medium text-on-primary bg-primary hover:opacity-90 focus:outline-none transition-opacity tracking-widest uppercase disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : 'Đăng Ký'}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <p className="font-body text-sm text-secondary">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-label font-medium text-primary hover:text-on-surface underline underline-offset-4 transition-colors">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
