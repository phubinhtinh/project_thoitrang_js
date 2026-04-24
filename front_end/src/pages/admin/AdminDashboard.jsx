import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI, productsAPI, categoriesAPI } from '../../api/axios';

const formatVND = (v) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(v) || 0);

const statusColor = {
  pending: 'bg-secondary-container text-on-secondary-container',
  processing: 'bg-primary-container text-on-primary-container',
  shipped: 'bg-tertiary-container text-on-tertiary-container',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-error-container text-on-error-container',
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [productsTotal, setProductsTotal] = useState(0);
  const [categoriesTotal, setCategoriesTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ordersAPI.getAll().catch(() => ({ data: [] })),
      productsAPI.getAll({ limit: 1 }).catch(() => ({ data: { pagination: { total: 0 } } })),
      categoriesAPI.getAll().catch(() => ({ data: [] })),
    ]).then(([ordRes, prodRes, catRes]) => {
      setOrders(ordRes.data || []);
      setProductsTotal(prodRes.data?.pagination?.total || 0);
      setCategoriesTotal((catRes.data || []).length);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.paymentStatus === 'paid' || o.status === 'delivered')
      .reduce((s, o) => s + Number(o.totalPrice || 0), 0);
    const pending = orders.filter((o) => o.status === 'pending').length;
    const delivered = orders.filter((o) => o.status === 'delivered').length;
    const uniqueCustomers = new Set(orders.map((o) => o.userId).filter(Boolean)).size;
    return { revenue, pending, delivered, uniqueCustomers };
  }, [orders]);

  const chart = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      days.push({ date: d, total: 0 });
    }
    orders.forEach((o) => {
      const od = new Date(o.createdAt);
      od.setHours(0, 0, 0, 0);
      const day = days.find((x) => x.date.getTime() === od.getTime());
      if (day) day.total += Number(o.totalPrice || 0);
    });
    const max = Math.max(1, ...days.map((d) => d.total));
    return { days, max };
  }, [orders]);

  const recentOrders = orders.slice(0, 5);

  const cards = [
    { label: 'Doanh thu', value: formatVND(stats.revenue), icon: 'payments', hint: 'Từ đơn đã thanh toán / giao' },
    { label: 'Tổng đơn', value: orders.length, icon: 'receipt_long', hint: 'Toàn bộ đơn hàng' },
    { label: 'Đơn chờ xử lý', value: stats.pending, icon: 'pending_actions', hint: 'Cần thao tác' },
    { label: 'Đơn đã giao', value: stats.delivered, icon: 'local_shipping', hint: 'Đã hoàn tất' },
    { label: 'Sản phẩm', value: productsTotal, icon: 'inventory_2' },
    { label: 'Danh mục', value: categoriesTotal, icon: 'category' },
    { label: 'Khách hàng', value: stats.uniqueCustomers, icon: 'group' },
  ];

  if (loading) {
    return (
      <div className="font-label text-sm uppercase tracking-widest text-secondary animate-pulse">
        Đang tải số liệu...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-headline text-3xl md:text-4xl text-on-background">Tổng quan</h2>
        <p className="font-body text-sm text-secondary mt-2">
          Theo dõi tình hình kinh doanh của ATELIER theo thời gian thực.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-surface border border-outline-variant/30 p-6 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="material-symbols-outlined text-primary">{c.icon}</span>
              <span className="font-label text-[10px] uppercase tracking-widest text-secondary">
                {c.label}
              </span>
            </div>
            <p className="font-headline text-2xl md:text-3xl text-on-background break-words">
              {c.value}
            </p>
            {c.hint && <p className="font-body text-xs text-secondary mt-2">{c.hint}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-outline-variant/30 p-6">
          <div className="flex items-baseline justify-between mb-8">
            <h3 className="font-headline text-xl text-on-background">Doanh thu 7 ngày</h3>
            <span className="font-label text-xs uppercase tracking-widest text-secondary">
              Tổng: {formatVND(chart.days.reduce((s, d) => s + d.total, 0))}
            </span>
          </div>
          <div className="flex items-end gap-3 h-48">
            {chart.days.map((d, i) => {
              const h = (d.total / chart.max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full flex-1 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-primary to-secondary transition-all duration-500 group relative"
                      style={{ height: `${Math.max(h, 2)}%` }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-label text-[10px] text-on-surface-variant opacity-0 group-hover:opacity-100 whitespace-nowrap">
                        {formatVND(d.total)}
                      </span>
                    </div>
                  </div>
                  <span className="font-label text-[10px] uppercase tracking-wider text-secondary">
                    {d.date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-surface border border-outline-variant/30 p-6">
          <div className="flex items-baseline justify-between mb-6">
            <h3 className="font-headline text-xl text-on-background">Đơn mới nhất</h3>
            <Link
              to="/admin/orders"
              className="font-label text-xs uppercase tracking-widest text-primary hover:text-on-background border-b border-primary/40"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 && (
              <p className="font-body text-sm text-secondary">Chưa có đơn hàng nào.</p>
            )}
            {recentOrders.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between py-3 border-b border-outline-variant/20 last:border-0"
              >
                <div className="min-w-0">
                  <p className="font-label text-sm text-on-surface truncate">
                    #{o.id} · {o.user?.fullName || 'Khách'}
                  </p>
                  <p className="font-label text-[11px] uppercase tracking-wider text-secondary mt-0.5">
                    {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="text-right pl-3">
                  <p className="font-label text-sm text-on-surface">{formatVND(o.totalPrice)}</p>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-label ${
                      statusColor[o.status] || 'bg-surface-container-high'
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
