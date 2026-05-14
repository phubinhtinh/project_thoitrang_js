import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../api/axios';
import toast from 'react-hot-toast';
import PaymentQRModal from '../components/PaymentQRModal';

export default function CheckoutPage() {
  const { cartItems, totalPrice, fetchCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shippingAddress: '',
    phoneReceiver: '',
    paymentMethod: 'cod',
  });
  const [loading, setLoading] = useState(false);
  const [qrModal, setQrModal] = useState({ open: false, orderId: null, amount: 0 });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }
    setLoading(true);
    try {
      const res = await ordersAPI.checkout(form);
      toast.success(res.data.message || '🎉 Đặt hàng thành công!');
      await fetchCart();

      // Nếu chọn chuyển khoản → mở modal QR thay vì redirect
      if (form.paymentMethod === 'banking' && res.data.order) {
        setQrModal({
          open: true,
          orderId: res.data.order.id,
          amount: Number(res.data.order.totalPrice),
        });
      } else {
        navigate('/orders');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đặt hàng thất bại');
    } finally {
      setLoading(false);
    }
  };

  const closeQrModal = () => {
    setQrModal({ open: false, orderId: null, amount: 0 });
    navigate('/orders');
  };

  const paymentMethods = [
    { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: 'local_shipping' },
    { value: 'banking', label: 'Chuyển khoản ngân hàng', icon: 'account_balance' },
    { value: 'momo', label: 'Ví MoMo', icon: 'contactless' },
    { value: 'vnpay', label: 'VNPay', icon: 'credit_card' },
  ];

  // Lưu ý: nếu modal QR đang mở (đặt hàng banking thành công, giỏ vừa được dọn),
  // KHÔNG show trang "giỏ trống" — phải giữ modal hiển thị cho user quét QR.
  if (cartItems.length === 0 && !qrModal.open) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen">
        <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">shopping_cart</span>
        <p className="font-body text-lg text-secondary mb-8">Giỏ hàng trống, không thể thanh toán</p>
        <button onClick={() => navigate('/collections')} className="bg-primary text-on-primary px-10 py-4 font-label text-xs uppercase tracking-widest">
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  // Khi modal đang mở mà giỏ trống → chỉ render modal, ẩn phần form/aside
  if (cartItems.length === 0 && qrModal.open) {
    return (
      <PaymentQRModal
        open={qrModal.open}
        orderId={qrModal.orderId}
        amount={qrModal.amount}
        onClose={closeQrModal}
      />
    );
  }

  return (
    <div className="pt-32 md:pt-40 pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto min-h-screen flex flex-col lg:flex-row gap-12 lg:gap-24">
      {/* Left: Form */}
      <section className="w-full lg:w-3/5 flex flex-col gap-14">
        <h1 className="font-headline text-4xl lg:text-5xl text-primary tracking-tight">Thanh Toán</h1>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Shipping */}
          <div className="space-y-6">
            <h2 className="font-headline text-2xl text-secondary">Thông Tin Giao Hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative md:col-span-2">
                <input
                  type="text"
                  name="shippingAddress"
                  value={form.shippingAddress}
                  onChange={handleChange}
                  required
                  placeholder="Địa chỉ giao hàng"
                  className="peer w-full bg-transparent border-0 border-b border-outline-variant/30 text-on-surface py-3 px-0 focus:ring-0 focus:border-primary transition-colors placeholder-transparent"
                  id="address"
                />
                <label
                  htmlFor="address"
                  className="absolute left-0 -top-3.5 text-xs font-label text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs"
                >
                  Địa chỉ giao hàng
                </label>
              </div>
              <div className="relative">
                <input
                  type="tel"
                  name="phoneReceiver"
                  value={form.phoneReceiver}
                  onChange={handleChange}
                  required
                  placeholder="Số điện thoại người nhận"
                  className="peer w-full bg-transparent border-0 border-b border-outline-variant/30 text-on-surface py-3 px-0 focus:ring-0 focus:border-primary transition-colors placeholder-transparent"
                  id="phone"
                />
                <label
                  htmlFor="phone"
                  className="absolute left-0 -top-3.5 text-xs font-label text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs"
                >
                  Số điện thoại người nhận
                </label>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="space-y-6">
            <h2 className="font-headline text-2xl text-secondary">Phương Thức Thanh Toán</h2>
            <div className="flex flex-col gap-3">
              {paymentMethods.map(pm => (
                <label
                  key={pm.value}
                  className={`flex items-center gap-4 p-5 cursor-pointer border transition-colors ${
                    form.paymentMethod === pm.value
                      ? 'bg-surface-container-low border-primary/30'
                      : 'bg-surface border-outline-variant/15 hover:bg-surface-container-low'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm.value}
                    checked={form.paymentMethod === pm.value}
                    onChange={handleChange}
                    className="text-primary focus:ring-primary bg-transparent border-outline-variant"
                  />
                  <span className="font-label text-sm tracking-wide text-on-surface">{pm.label}</span>
                  <span className="material-symbols-outlined ml-auto text-secondary">{pm.icon}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit (mobile) */}
          <div className="lg:hidden">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-5 font-label uppercase tracking-[0.2em] text-[11px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Đặt Hàng'}
            </button>
          </div>
        </form>
      </section>

      {/* Right: Order Summary */}
      <aside className="w-full lg:w-2/5">
        <div className="sticky top-36 bg-surface-container-lowest p-8 md:p-10 border border-outline-variant/15">
          <h2 className="font-headline text-2xl text-primary mb-8">Đơn Hàng</h2>
          <div className="space-y-6 mb-10">
            {cartItems.map(item => {
              const product = item.variant?.color?.product;
              const price = product?.discountPrice || product?.basePrice || 0;
              return (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 bg-surface-variant flex-shrink-0 overflow-hidden">
                    {item.variant?.color?.img ? (
                      <img src={item.variant.color.img} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-outline-variant">image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between py-1 w-full">
                    <div>
                      <h3 className="font-body text-sm font-medium text-on-surface uppercase tracking-wider line-clamp-1">{product?.name}</h3>
                      <p className="font-body text-xs text-secondary mt-1">{item.variant?.size} | {item.variant?.color?.name}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-body text-xs text-secondary">SL: {item.quantity}</span>
                      <span className="font-headline text-base text-primary">{formatPrice(Number(price) * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="space-y-3 pt-6 border-t border-outline-variant/15 mb-8">
            <div className="flex justify-between font-body text-sm text-secondary">
              <span>Tạm tính</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between font-body text-sm text-secondary">
              <span>Phí vận chuyển</span>
              <span>Miễn phí</span>
            </div>
          </div>
          <div className="flex justify-between items-end mb-10">
            <span className="font-headline text-xl text-primary">Tổng</span>
            <span className="font-headline text-2xl text-primary">{formatPrice(totalPrice)}</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="hidden lg:block w-full bg-primary text-on-primary py-5 font-label uppercase tracking-[0.2em] text-[10px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Đặt Hàng'}
          </button>
          <p className="font-body text-[10px] text-center text-secondary mt-5 uppercase tracking-widest">
            Thanh toán bảo mật
          </p>
        </div>
      </aside>

      <PaymentQRModal
        open={qrModal.open}
        orderId={qrModal.orderId}
        amount={qrModal.amount}
        onClose={closeQrModal}
      />
    </div>
  );
}
