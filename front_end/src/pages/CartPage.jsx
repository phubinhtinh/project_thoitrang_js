import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cartItems, totalPrice, loading, updateQuantity, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      await updateQuantity(itemId, newQty);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi cập nhật số lượng');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeItem(itemId);
      toast.success('Đã xóa khỏi giỏ hàng');
    } catch (err) {
      toast.error('Lỗi xóa sản phẩm');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen">
        <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">shopping_bag</span>
        <h1 className="font-headline text-3xl mb-4">Giỏ Hàng</h1>
        <p className="text-secondary mb-8">Vui lòng đăng nhập để xem giỏ hàng</p>
        <Link to="/login" className="bg-primary text-on-primary px-10 py-4 font-label text-xs uppercase tracking-widest">
          Đăng Nhập
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-32 pb-24 px-6 md:px-8 max-w-[1920px] mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-16">
        <h1 className="font-headline text-5xl md:text-7xl tracking-tight leading-none mb-4 font-light italic">Giỏ Hàng</h1>
        <p className="font-body text-secondary text-sm uppercase tracking-[0.3em]">ATELIER / Giỏ hàng của bạn</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 block">shopping_bag</span>
          <p className="font-body text-lg text-secondary mb-8">Giỏ hàng trống</p>
          <Link to="/collections" className="bg-primary text-on-primary px-10 py-4 font-label text-xs uppercase tracking-widest hover:bg-primary-dim transition-colors">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Items */}
          <div className="lg:col-span-8 space-y-8">
            {cartItems.map((item) => {
              const product = item.variant?.productColor?.product;
              const price = product?.discountPrice || product?.basePrice || 0;
              return (
                <div key={item.id} className="flex flex-col md:flex-row gap-6 bg-surface-container-low p-6 md:p-8 group">
                  <div className="w-full md:w-48 h-60 bg-surface-variant overflow-hidden flex-shrink-0">
                    {item.variant?.productColor?.img ? (
                      <img
                        alt={product.name}
                        src={item.variant.productColor.img}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-outline-variant">image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <Link to={`/products/${product?.id}`}>
                          <h2 className="font-headline text-xl md:text-2xl font-light tracking-tight text-on-surface hover:opacity-70 transition-opacity">
                            {product?.name}
                          </h2>
                        </Link>
                        <span className="text-xl font-light font-headline ml-4">{formatPrice(price)}</span>
                      </div>
                      <div className="flex gap-6 text-[11px] uppercase tracking-widest text-secondary font-medium">
                        <div>Size: {item.variant?.size}</div>
                        <div>Màu: {item.variant?.productColor?.color}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-end mt-6">
                      <div className="flex items-center gap-5 border-b border-outline-variant/30 pb-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="text-secondary hover:text-on-surface transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="font-body text-sm font-medium w-6 text-center">
                          {String(item.quantity).padStart(2, '0')}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="text-secondary hover:text-on-surface transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-secondary hover:text-error transition-colors uppercase text-[10px] tracking-[0.2em]"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <aside className="lg:col-span-4 sticky top-28">
            <div className="bg-surface-container-high p-8 md:p-10 space-y-8">
              <h3 className="font-headline text-2xl font-light tracking-tight border-b border-outline-variant/20 pb-4">
                Tổng Đơn
              </h3>
              <div className="space-y-4 font-body text-sm">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Tạm tính</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Phí vận chuyển</span>
                  <span className="text-secondary text-xs">Tính khi thanh toán</span>
                </div>
                <div className="pt-6 flex justify-between text-xl font-medium text-on-surface">
                  <span className="font-headline">Tổng cộng</span>
                  <span className="font-headline">{formatPrice(totalPrice)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary text-on-primary py-5 text-[11px] uppercase tracking-[0.3em] font-medium hover:bg-primary-dim transition-all duration-300"
              >
                Tiến Hành Thanh Toán
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
