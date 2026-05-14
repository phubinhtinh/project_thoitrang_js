import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI, reviewsAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, user, isAdmin } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState({ reviews: [], avgRating: 0, totalReviews: 0 });
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

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

  // --- Review handlers ---
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewRating) { toast.error('Vui lòng chọn số sao đánh giá'); return; }
    try {
      setSubmittingReview(true);
      const res = await reviewsAPI.create(id, { rating: reviewRating, comment: reviewComment || undefined });
      // Thêm review mới vào đầu danh sách
      setReviews(prev => ({
        reviews: [res.data, ...prev.reviews],
        totalReviews: prev.totalReviews + 1,
        avgRating: Math.round(((prev.avgRating * prev.totalReviews + reviewRating) / (prev.totalReviews + 1)) * 10) / 10,
      }));
      setReviewRating(0);
      setReviewComment('');
      toast.success('Đánh giá đã được gửi thành công!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể gửi đánh giá');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
    try {
      setDeletingReviewId(reviewId);
      await reviewsAPI.remove(reviewId);
      setReviews(prev => {
        const filtered = prev.reviews.filter(r => r.id !== reviewId);
        const avgRating = filtered.length
          ? Math.round((filtered.reduce((sum, r) => sum + r.rating, 0) / filtered.length) * 10) / 10
          : 0;
        return { reviews: filtered, totalReviews: filtered.length, avgRating };
      });
      toast.success('Đã xóa đánh giá');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể xóa đánh giá');
    } finally {
      setDeletingReviewId(null);
    }
  };

  const getInitial = (name) => (name || 'U').charAt(0).toUpperCase();

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

      {/* ==================== REVIEWS SECTION ==================== */}
      <section className="mt-24 md:mt-32 max-w-[1920px] mx-auto px-6 md:px-12">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="flex items-end justify-between mb-12 border-b border-outline-variant/20 pb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-headline tracking-tight">Đánh Giá & Bình Luận</h2>
              <p className="font-body text-sm text-outline mt-2">
                {reviews.totalReviews > 0
                  ? `${reviews.totalReviews} đánh giá — Trung bình ${reviews.avgRating}/5 sao`
                  : 'Chưa có đánh giá nào. Hãy là người đầu tiên!'}
              </p>
            </div>
            {reviews.totalReviews > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-headline font-semibold text-secondary-dim">{reviews.avgRating}</span>
                <div className="flex">{renderStars(Math.round(reviews.avgRating))}</div>
              </div>
            )}
          </div>

          {/* Review Form */}
          {isAuthenticated ? (
            <form onSubmit={handleSubmitReview} className="mb-16 bg-surface-container-low p-6 md:p-8 animate-fade-in" id="review-form">
              <h3 className="font-headline text-lg mb-6">Viết đánh giá của bạn</h3>

              {/* Star Rating Input */}
              <div className="mb-6">
                <label className="font-body text-xs uppercase tracking-widest text-outline block mb-3">Đánh giá sao</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setReviewHover(star)}
                      onMouseLeave={() => setReviewHover(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                      aria-label={`${star} sao`}
                    >
                      <span
                        className={`material-symbols-outlined text-2xl transition-colors duration-200 ${
                          star <= (reviewHover || reviewRating)
                            ? 'text-amber-500'
                            : 'text-outline-variant/30'
                        }`}
                        style={{
                          fontVariationSettings: star <= (reviewHover || reviewRating) ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        star
                      </span>
                    </button>
                  ))}
                  {reviewRating > 0 && (
                    <span className="ml-3 font-body text-sm text-secondary self-center">
                      {reviewRating === 1 && 'Rất tệ'}
                      {reviewRating === 2 && 'Tệ'}
                      {reviewRating === 3 && 'Bình thường'}
                      {reviewRating === 4 && 'Tốt'}
                      {reviewRating === 5 && 'Tuyệt vời'}
                    </span>
                  )}
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="mb-6">
                <label className="font-body text-xs uppercase tracking-widest text-outline block mb-3">Bình luận (không bắt buộc)</label>
                <textarea
                  id="review-comment"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-outline-variant/30 text-on-surface text-sm font-body leading-relaxed resize-none transition-all duration-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-outline-variant/50"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submittingReview || !reviewRating}
                className="px-8 py-3.5 bg-primary text-on-primary text-sm uppercase tracking-[0.15em] font-medium hover:bg-primary-dim transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submittingReview ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">send</span>
                    Gửi Đánh Giá
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="mb-16 bg-surface-container-low p-6 md:p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-outline-variant/40 mb-3 block">rate_review</span>
              <p className="font-body text-sm text-outline mb-4">Đăng nhập để viết đánh giá cho sản phẩm này</p>
              <Link to="/login" className="inline-block px-6 py-3 bg-primary text-on-primary text-sm uppercase tracking-[0.15em] font-medium hover:bg-primary-dim transition-all">
                Đăng Nhập
              </Link>
            </div>
          )}

          {/* Reviews List */}
          {reviews.reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="bg-surface-container-low p-6 md:p-8 animate-fade-in group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-headline text-sm font-semibold shrink-0">
                        {getInitial(review.user?.fullName)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                          <span className="font-body text-sm font-semibold text-on-surface">{review.user?.fullName || 'Ẩn danh'}</span>
                          <div className="flex">{renderStars(review.rating)}</div>
                        </div>
                        <span className="font-label text-xs text-outline">{new Date(review.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        {review.comment && (
                          <p className="text-on-surface-variant text-sm leading-relaxed mt-3">{review.comment}</p>
                        )}
                      </div>
                    </div>

                    {/* Delete button */}
                    {(user?.id === review.userId || isAdmin) && (
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={deletingReviewId === review.id}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-outline hover:text-error shrink-0"
                        title="Xóa đánh giá"
                      >
                        <span className="material-symbols-outlined text-lg">
                          {deletingReviewId === review.id ? 'progress_activity' : 'delete'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-5xl text-outline-variant/30 block mb-3">chat_bubble_outline</span>
              <p className="font-body text-sm text-outline">Chưa có đánh giá nào cho sản phẩm này</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
