import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI, reviewsAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState({ reviews: [], avgRating: 0, totalReviews: 0 });
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([productsAPI.getOne(id), reviewsAPI.getByProduct(id)])
      .then(([productRes, reviewsRes]) => { setProduct(productRes.data); setReviews(reviewsRes.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Auto-select first color
  useEffect(() => {
    if (product?.colors?.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  // Sizes of selected color
  const sizes = selectedColor?.variants?.map(v => v.size) || [];

  // Auto-select size if only one
  useEffect(() => {
    if (sizes.length === 1 && !selectedSize) setSelectedSize(sizes[0]);
  }, [selectedColor]);

  // Find matching variant
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const variant = selectedColor.variants?.find(v => v.size === selectedSize);
      setSelectedVariant(variant || null);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedSize, selectedColor]);

  // Reset size when color changes
  const handleColorChange = (color) => {
    setSelectedColor(color);
    setSelectedSize('');
    setSelectedVariant(null);
  };

  const displayedImage = selectedColor?.img || product?.colors?.[0]?.img;

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng'); return; }
    if (!product?.colors?.length) { toast.error('Sản phẩm này tạm chưa có biến thể để bán'); return; }
    if (!selectedVariant) {
      if (!selectedColor) toast.error('Vui lòng chọn màu sắc');
      else if (!selectedSize) toast.error('Vui lòng chọn size');
      else toast.error('Vui lòng chọn size và màu sắc');
      return;
    }
    if (selectedVariant.stockQuantity <= 0) { toast.error('Sản phẩm tạm hết hàng'); return; }
    try {
      setAddingToCart(true);
      await addToCart(selectedVariant.id);
      toast.success('Đã thêm vào giỏ hàng!');
    } catch (err) { toast.error(err.response?.data?.message || 'Không thể thêm vào giỏ hàng'); }
    finally { setAddingToCart(false); }
  };

  const renderStars = (rating) => [...Array(5)].map((_, i) => (
    <span key={i} className={`material-symbols-outlined text-sm ${i < rating ? 'text-secondary-dim' : 'text-outline-variant/40'}`}
      style={{ fontVariationSettings: i < rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
  ));

  if (loading) return (
    <div className="pt-32 pb-24 max-w-[1920px] mx-auto px-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7"><div className="aspect-[3/4] bg-surface-container-high" /></div>
        <div className="lg:col-span-5 space-y-6"><div className="h-4 bg-surface-container-high w-1/3" /><div className="h-10 bg-surface-container-high w-2/3" /><div className="h-5 bg-surface-container-high w-1/4" /></div>
      </div>
    </div>
  );

  if (!product) return <div className="pt-32 pb-24 text-center"><p className="font-body text-lg text-secondary">Sản phẩm không tồn tại</p></div>;

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <section className="max-w-[1920px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-start">
        {/* Left: Images */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="bg-surface-variant aspect-[3/4] overflow-hidden group relative">
            {displayedImage ? (
              <img key={displayedImage} alt={product.name} src={displayedImage} className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 animate-fade-in" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-6xl text-outline-variant">image</span></div>
            )}
          </div>
          {/* Color thumbnails */}
          {product.colors?.length > 1 && (
            <div className="flex gap-3 flex-wrap">
              {product.colors.map(c => c.img && (
                <button key={c.id} onClick={() => handleColorChange(c)}
                  className={`w-20 h-24 overflow-hidden border-2 transition-all ${selectedColor?.id === c.id ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`} title={c.name}>
                  <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="lg:col-span-5 lg:sticky lg:top-36 space-y-10">
          <div className="space-y-4">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-outline">{product.category?.name || 'Bộ sưu tập'}</p>
            <h1 className="text-4xl lg:text-5xl font-headline tracking-tight text-on-background leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              {product.discountPrice ? (
                <><p className="text-xl font-body font-medium text-error">{formatPrice(product.discountPrice)}</p><p className="text-lg font-body text-outline line-through">{formatPrice(product.basePrice)}</p></>
              ) : (
                <p className="text-xl font-body font-light text-secondary">{formatPrice(product.basePrice)}</p>
              )}
            </div>
            {reviews.totalReviews > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(Math.round(reviews.avgRating))}</div>
                <span className="font-label text-xs text-secondary">({reviews.avgRating}/5 - {reviews.totalReviews} đánh giá)</span>
              </div>
            )}
          </div>

          {product.description && <p className="text-on-surface-variant leading-relaxed text-base max-w-lg">{product.description}</p>}

          {/* Color Selection */}
          {product.colors?.length > 0 && (
            <div className="space-y-4">
              <label className="font-body text-xs uppercase tracking-widest text-on-surface">
                Màu sắc {selectedColor && <span className="text-secondary">— {selectedColor.name}</span>}
              </label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map(color => (
                  <button key={color.id} onClick={() => handleColorChange(color)}
                    className={`px-5 py-3 text-sm font-light transition-all border ${selectedColor?.id === color.id ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant/30 hover:border-primary'}`}>
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div className="space-y-4">
              <label className="font-body text-xs uppercase tracking-widest text-on-surface">Chọn Size</label>
              <div className="flex flex-wrap gap-3">
                {selectedColor.variants.map(v => {
                  const outOfStock = v.stockQuantity === 0;
                  return (
                    <button key={v.id} onClick={() => !outOfStock && setSelectedSize(v.size)} disabled={outOfStock}
                      className={`w-14 h-14 flex items-center justify-center text-sm font-light transition-all border ${
                        outOfStock ? 'border-outline-variant/20 text-outline-variant/40 cursor-not-allowed line-through'
                        : selectedSize === v.size ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant/30 hover:border-primary'}`}>
                      {v.size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock Info */}
          {selectedVariant && (
            <div className={`font-label text-xs uppercase tracking-widest ${selectedVariant.stockQuantity > 0 ? 'text-secondary' : 'text-error'}`}>
              {selectedVariant.stockQuantity > 0 ? `Còn ${selectedVariant.stockQuantity} sản phẩm` : 'Tạm hết hàng'}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-4 pt-2">
            <button onClick={handleAddToCart} disabled={addingToCart || (selectedVariant && selectedVariant.stockQuantity <= 0)}
              className="w-full bg-primary text-on-primary py-5 text-sm uppercase tracking-[0.2em] font-medium hover:bg-primary-dim transition-all shadow-xl shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed">
              {addingToCart ? 'Đang thêm...' : selectedVariant?.stockQuantity <= 0 ? 'Hết hàng' : 'Thêm Vào Giỏ'}
            </button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      {reviews.reviews.length > 0 && (
        <section className="mt-24 md:mt-32 max-w-[1920px] mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl font-headline tracking-tight mb-12">Đánh Giá ({reviews.totalReviews})</h2>
          <div className="space-y-8 max-w-3xl">
            {reviews.reviews.map(review => (
              <div key={review.id} className="bg-surface-container-low p-6 md:p-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-body text-sm font-medium">{review.user?.fullName}</span>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </div>
                  <span className="font-label text-xs text-outline">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                {review.comment && <p className="text-on-surface-variant text-sm leading-relaxed">{review.comment}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
