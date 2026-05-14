import { Fragment, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { ordersAPI } from '../../api/axios';

const formatVND = (v) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(v) || 0);

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['unpaid', 'paid'];

const statusStyle = {
  pending: 'bg-secondary-container text-on-secondary-container',
  processing: 'bg-primary-container text-on-primary-container',
  shipped: 'bg-tertiary-container text-on-tertiary-container',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-error-container text-on-error-container',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = () => {
    setLoading(true);
    ordersAPI
      .getAll()
      .then((res) => setOrders(res.data || []))
      .catch(() => toast.error('Không tải được đơn hàng'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  const updateStatus = async (id, status) => {
    try {
      await ordersAPI.updateStatus(id, { status });
      toast.success('Đã cập nhật trạng thái');
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const updatePayment = async (id, paymentStatus) => {
    try {
      await ordersAPI.updatePayment(id, { paymentStatus });
      toast.success('Đã cập nhật thanh toán');
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, paymentStatus } : o)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-headline text-3xl md:text-4xl text-on-background">Đơn hàng</h2>
        <p className="font-body text-sm text-secondary mt-2">
          Toàn bộ đơn hàng của khách — cập nhật trạng thái & thanh toán.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', ...ORDER_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 font-label text-xs uppercase tracking-widest transition-colors ${
              filter === s
                ? 'bg-on-background text-surface'
                : 'bg-surface border border-outline-variant/30 text-on-surface-variant hover:border-primary'
            }`}
          >
            {s === 'all' ? 'Tất cả' : s} (
            {s === 'all' ? orders.length : orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      <div className="bg-surface border border-outline-variant/30 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low">
            <tr className="font-label text-[10px] uppercase tracking-widest text-secondary">
              <th className="px-4 py-3 w-8"></th>
              <th className="px-4 py-3">Mã đơn</th>
              <th className="px-4 py-3">Khách hàng</th>
              <th className="px-4 py-3">Ngày</th>
              <th className="px-4 py-3">Tổng tiền</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Thanh toán</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-secondary text-sm">
                  Đang tải...
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-secondary text-sm">
                  Không có đơn hàng.
                </td>
              </tr>
            )}
            {filtered.map((o) => (
              <Fragment key={o.id}>
                <tr className="hover:bg-surface-container-low/50">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}
                      className="text-secondary hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {expandedId === o.id ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3 font-label text-sm text-on-surface">#{o.id}</td>
                  <td className="px-4 py-3 font-body text-sm text-on-surface min-w-[180px]">
                    <p className="truncate max-w-[200px]">{o.user?.fullName || 'Khách'}</p>
                    <p className="font-label text-[10px] uppercase tracking-wider text-secondary mt-0.5 truncate max-w-[200px]">
                      {o.user?.email || o.phoneReceiver}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-label text-xs text-on-surface-variant">
                    {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                    <br />
                    <span className="text-secondary">
                      {new Date(o.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-label text-sm text-on-surface whitespace-nowrap">
                    {formatVND(o.totalPrice)}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className={`px-2 py-1 font-label text-[11px] uppercase tracking-wider border-0 outline-none cursor-pointer ${
                        statusStyle[o.status] || 'bg-surface-container-high'
                      }`}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={o.paymentStatus}
                      onChange={(e) => updatePayment(o.id, e.target.value)}
                      className={`px-2 py-1 font-label text-[11px] uppercase tracking-wider border-0 outline-none cursor-pointer ${
                        o.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-error-container text-on-error-container'
                      }`}
                    >
                      {PAYMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                {expandedId === o.id && (
                  <tr className="bg-surface-container-low/60">
                    <td colSpan={7} className="px-6 py-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <p className="font-label text-[10px] uppercase tracking-widest text-secondary mb-2">
                            Địa chỉ giao
                          </p>
                          <p className="font-body text-sm text-on-surface">{o.shippingAddress}</p>
                          <p className="font-body text-sm text-on-surface-variant mt-1">
                            SĐT: {o.phoneReceiver}
                          </p>
                        </div>
                        <div>
                          <p className="font-label text-[10px] uppercase tracking-widest text-secondary mb-2">
                            Phương thức
                          </p>
                          <p className="font-body text-sm text-on-surface uppercase">
                            {o.paymentMethod}
                          </p>
                        </div>
                        <div>
                          <p className="font-label text-[10px] uppercase tracking-widest text-secondary mb-2">
                            Sản phẩm ({o.items?.length || 0})
                          </p>
                          <div className="space-y-2">
                            {o.items?.map((it) => (
                              <div key={it.id} className="flex items-center gap-3 text-sm">
                                <div className="w-10 h-10 bg-surface-variant flex-shrink-0 overflow-hidden">
                                  {it.variant?.color?.img ? (
                                    <img
                                      src={it.variant.color.img}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                  ) : null}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="truncate text-on-surface">
                                    {it.variant?.color?.product?.name}
                                  </p>
                                  <p className="text-[10px] uppercase tracking-wider text-secondary">
                                    {it.variant?.color?.name} · {it.variant?.size} × {it.quantity}
                                  </p>
                                </div>
                                <p className="font-label text-xs text-on-surface">
                                  {formatVND(Number(it.price) * it.quantity)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
