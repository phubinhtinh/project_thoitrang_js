import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI, reviewsAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const statusMap = {
  pending: { label: 'Chờ xử lý', color: 'bg-secondary-fixed text-on-secondary-fixed' },
  processing: { label: 'Đang xử lý', color: 'bg-primary-container text-on-primary-container' },
  shipped: { label: 'Đang giao', color: 'bg-tertiary-container text-on-tertiary-container' },
  delivered: { label: 'Đã giao', color: 'bg-surface-container-high text-on-surface' },
  cancelled: { label: 'Đã hủy', color: 'bg-error-container text-on-error-container' },
};

const paymentStatusMap = {
  unpaid: { label: 'Chưa thanh toán', color: 'text-error' },
  paid: { label: 'Đã thanh toán', color: 'text-secondary-dim' },
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    if (!isAuthenticated) return;
    ordersAPI.getAll().then(res => setOrders(res.data || [])).catch(console.error).finally(() => setLoading(false));
  }, [isAuthenticated]);

  const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  const handleReview = async (productId) => {
    try {
      await reviewsAPI.create(productId, reviewForm);
      toast.success('Đánh giá thành công!');
      setReviewModal(null);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể đánh giá');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen">
        <p className="text-secondary mb-8">Vui lòng đăng nhập để xem đơn hàng</p>
        <Link to="/login" className="bg-primary text-on-primary px-10 py-4 font-label text-xs uppercase tracking-widest">Đăng Nhập</Link>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-32 pb-24 px-6 md:px-8 max-w-[1920px] mx-auto min-h-screen">
      <div className="mb-14">
        <h1 className="font-headline text-4xl md:text-6xl font-light tracking-tight italic mb-3">Đơn Hàng</h1>
        <p className="font-body text-secondary text-sm uppercase tracking-[0.3em]">Lịch sử đơn hàng của bạn</p>
      </div>

      {loading ? (
        <div className="space-y-6">{[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-surface-container-high animate-pulse"/>)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">receipt_long</span>
          <p className="font-body text-lg text-secondary mb-8">Chưa có đơn hàng nào</p>
          <Link to="/collections" className="bg-primary text-on-primary px-10 py-4 font-label text-xs uppercase tracking-widest">Mua sắm ngay</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map(order => (
            <div key={order.id} className="bg-surface-container-low p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h3 className="font-headline text-lg">Đơn #{order.id}</h3>
                  <p className="font-label text-xs text-secondary mt-1">{new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-medium ${statusMap[order.status]?.color || 'bg-surface-container'}`}>
                    {statusMap[order.status]?.label || order.status}
                  </span>
                  <span className={`text-[10px] uppercase tracking-widest font-medium ${paymentStatusMap[order.paymentStatus]?.color}`}>
                    {paymentStatusMap[order.paymentStatus]?.label}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {order.items?.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-20 bg-surface-variant flex-shrink-0 overflow-hidden">
                      {item.variant?.color?.img ? (
                        <img src={item.variant.color.img} alt={item.variant.color?.product?.name} className="w-full h-full object-cover"/>
                      ) : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-outline-variant text-sm">image</span></div>}
                    </div>
                    <div className="flex-1">
                      <Link to={`/products/${item.variant?.color?.product?.id}`} className="font-body text-sm font-medium hover:opacity-70 transition-opacity">{item.variant?.color?.product?.name}</Link>
                      <p className="font-label text-xs text-secondary">{item.variant?.size} / {item.variant?.color?.name} × {item.quantity}</p>
                    </div>
                    <span className="font-body text-sm">{fmt(item.price)}</span>
                    {order.status === 'delivered' && (
                      <button onClick={() => setReviewModal(item.variant?.color?.product?.id)} className="text-[10px] uppercase tracking-widest text-primary border-b border-primary/30 pb-0.5 hover:border-primary transition-colors">
                        Đánh giá
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/15 flex justify-between items-center">
                <div className="font-label text-xs text-secondary">
                  <span>{order.shippingAddress}</span> · <span>{order.phoneReceiver}</span>
                </div>
                <span className="font-headline text-lg">{fmt(order.totalPrice)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setReviewModal(null)}>
          <div className="bg-surface p-8 max-w-md w-full mx-4 animate-scale-in" onClick={e => e.stopPropagation()}>
            <h3 className="font-headline text-2xl mb-6">Đánh Giá Sản Phẩm</h3>
            <div className="space-y-6">
              <div>
                <label className="font-label text-xs uppercase tracking-widest text-secondary block mb-3">Số sao</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} onClick={() => setReviewForm({...reviewForm, rating: star})} className="text-2xl transition-transform hover:scale-110">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: star <= reviewForm.rating ? "'FILL' 1" : "'FILL' 0", color: star <= reviewForm.rating ? '#5b5241' : '#afb3ae' }}>star</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-label text-xs uppercase tracking-widest text-secondary block mb-2">Nhận xét</label>
                <textarea value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} rows={3}
                  className="w-full bg-transparent border border-outline-variant/30 p-3 text-sm focus:ring-0 focus:border-primary transition-colors" placeholder="Viết nhận xét..."/>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleReview(reviewModal)} className="flex-1 bg-primary text-on-primary py-3 text-xs uppercase tracking-widest">Gửi đánh giá</button>
                <button onClick={() => setReviewModal(null)} className="px-6 py-3 text-xs uppercase tracking-widest border border-outline-variant/30 hover:bg-surface-container transition-colors">Hủy</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
