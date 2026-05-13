import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../api/axios';

const heroSlides = [
  {
    img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=90&auto=format&fit=crop',
    label: 'Lookbook',
    title: 'Xuân Hè 2026',
  },
  {
    img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=90&auto=format&fit=crop',
    label: 'Editorial',
    title: 'Nét Đẹp Tinh Khôi',
  },
  {
    img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=90&auto=format&fit=crop',
    label: 'Signature',
    title: 'Phong Cách Milan',
  },
  {
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=90&auto=format&fit=crop',
    label: 'Collection',
    title: 'Thanh Lịch Cổ Điển',
  },
  {
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=90&auto=format&fit=crop',
    label: 'Runway',
    title: 'Haute Couture',
  },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    productsAPI.getAll({ limit: 8 }).then(res => setProducts(res.data.data || [])).catch(console.error);
    categoriesAPI.getAll().then(res => setCategories(res.data || [])).catch(console.error);
  }, []);

  // Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (idx) => setCurrentSlide(idx);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="pt-0">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-surface-container-low pt-20">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 pointer-events-none" />
        <div className="absolute -top-[20%] -right-[10%] w-[60%] aspect-square rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="w-full max-w-[1920px] mx-auto px-8 md:px-16 lg:px-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative z-10">
          {/* Content Left */}
          <div className="flex-1 animate-slide-up pt-12 lg:pt-0">
            <div className="inline-block px-4 py-1.5 mb-6 border border-primary/30 rounded-full bg-primary/5">
              <span className="font-label text-xs uppercase tracking-widest text-primary font-medium">✨ Bộ Sưu Tập Mới Nhất</span>
            </div>
            
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl text-on-surface leading-tight tracking-tight mb-6">
              Định Hình <br /> <span className="italic font-light text-primary">Phong Cách</span>
            </h1>
            
            <div className="relative mb-8">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary rounded-full"></div>
              <p className="font-headline text-2xl md:text-3xl text-on-surface-variant italic pl-6 py-2">
                "Đánh Thức Vẻ Đẹp Tiềm Ẩn - Khẳng Định Khí Chất Riêng"
              </p>
            </div>
            
            <p className="font-body text-lg text-secondary max-w-lg leading-relaxed mb-10">
              Khám phá những thiết kế tinh tế nhất, nơi phong cách gặp gỡ sự hoàn mỹ trong từng đường kim mũi chỉ. Tự tin thể hiện bản sắc cá nhân với những bộ trang phục sang trọng.
            </p>
            
            <div className="flex items-center gap-6">
              <Link
                to="/collections"
                className="bg-primary text-on-primary px-10 py-4 font-label text-sm uppercase tracking-[0.2em] hover:bg-on-background transition-colors duration-500 shadow-xl shadow-primary/20 text-center"
              >
                Khám Phá Ngay
              </Link>
            </div>
          </div>
          
          {/* Image Slider Right */}
          <div className="flex-1 relative w-full max-w-2xl lg:max-w-none animate-fade-in pb-12 lg:pb-0" style={{ animationDelay: '0.2s' }}>
            <div className="relative aspect-[3/4] md:aspect-square lg:aspect-[4/5] rounded-tl-[80px] rounded-br-[80px] md:rounded-tl-[120px] md:rounded-br-[120px] overflow-hidden shadow-2xl group">
              {/* Slides */}
              {heroSlides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    alt={slide.title}
                    className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${
                      currentSlide === idx ? 'scale-110' : 'scale-100'
                    }`}
                    src={slide.img}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                </div>
              ))}

              {/* Caption (synced with active slide) */}
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end z-20 pointer-events-none">
                <div className="text-white pointer-events-auto">
                  <p className="font-label text-xs uppercase tracking-widest opacity-80 mb-1">
                    {heroSlides[currentSlide].label}
                  </p>
                  <p className="font-headline text-2xl md:text-3xl">
                    {heroSlides[currentSlide].title}
                  </p>
                </div>
                <Link
                  to="/collections"
                  className="pointer-events-auto w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                >
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>

              {/* Slide counter */}
              <div className="absolute top-6 right-6 z-20 bg-black/30 backdrop-blur-md text-white px-3 py-1 font-label text-xs tracking-widest">
                {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-3 mt-6">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Chuyển đến slide ${idx + 1}`}
                  className={`relative h-[2px] transition-all duration-500 ${
                    currentSlide === idx
                      ? 'w-12 bg-primary'
                      : 'w-6 bg-outline-variant hover:bg-primary/50'
                  }`}
                >
                  {currentSlide === idx && (
                    <span className="absolute inset-0 bg-on-background animate-slide-progress origin-left" />
                  )}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-20 md:py-28 bg-surface">
          <div className="max-w-[1920px] mx-auto px-8 md:px-16 lg:px-24">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-8">
              <h2 className="font-headline text-4xl md:text-5xl text-on-background">Danh Mục</h2>
              <p className="font-body text-secondary max-w-xs text-sm uppercase tracking-widest">Khám phá theo phong cách</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((cat, idx) => (
                <Link
                  key={cat.id}
                  to={`/collections?category=${cat.id}`}
                  className={`group cursor-pointer animate-fade-in stagger-${idx + 1}`}
                >
                  <div className="bg-surface-container-high p-8 md:p-10 text-center hover:bg-primary-container transition-all duration-500">
                    <h3 className="font-headline text-lg md:text-xl text-on-background group-hover:text-on-primary-container transition-colors">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="font-body text-xs text-secondary mt-2 line-clamp-2">{cat.description}</p>
                    )}
                    {cat.children?.length > 0 && (
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {cat.children.map(child => (
                          <span key={child.id} className="text-[10px] uppercase tracking-widest text-outline px-2 py-1 bg-surface/50">
                            {child.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-20 md:py-28 bg-surface-container-low">
        <div className="max-w-[1920px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-8">
            <h2 className="font-headline text-4xl md:text-5xl text-on-background">Sản Phẩm Mới</h2>
            <Link
              to="/collections"
              className="font-body text-sm uppercase tracking-widest text-secondary hover:text-primary transition-colors border-b border-secondary/30 pb-1"
            >
              Xem Tất Cả
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map((product, idx) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className={`group cursor-pointer animate-fade-in stagger-${Math.min(idx + 1, 6)}`}
              >
                <div className="relative aspect-[3/4] bg-surface-container overflow-hidden mb-5">
                  {product.variants?.[0]?.img ? (
                    <img
                      src={product.variants[0].img}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-variant">
                      <span className="material-symbols-outlined text-4xl text-outline-variant">image</span>
                    </div>
                  )}
                  {product.discountPrice && (
                    <div className="absolute top-4 left-4 bg-error/90 text-on-error px-3 py-1">
                      <span className="font-label text-[10px] uppercase tracking-widest">Giảm giá</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-headline text-base md:text-lg mb-1 group-hover:opacity-70 transition-opacity line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                      {product.category?.name || 'Chưa phân loại'}
                    </p>
                  </div>
                  <div className="text-right">
                    {product.discountPrice ? (
                      <>
                        <span className="font-label text-sm text-error font-medium">{formatPrice(product.discountPrice)}</span>
                        <span className="block font-label text-xs text-outline line-through">{formatPrice(product.basePrice)}</span>
                      </>
                    ) : (
                      <span className="font-label text-sm text-primary">{formatPrice(product.basePrice)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 md:py-40 bg-surface-container overflow-hidden">
        <div className="max-w-[1920px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-center">
            <div className="relative">
              <div className="aspect-[4/5] bg-surface-variant overflow-hidden w-4/5 ml-auto">
                <img
                  alt="Artisan at work"
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80&auto=format&fit=crop"
                />
              </div>
              <div className="absolute -bottom-12 -left-4 md:-left-12 w-2/3 aspect-square bg-surface overflow-hidden editorial-shadow">
                <img
                  alt="Fashion detail"
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80&auto=format&fit=crop"
                />
              </div>
            </div>
            <div>
              <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary mb-6 block">Câu Chuyện</span>
              <h2 className="font-headline text-4xl md:text-5xl text-on-background mb-10 leading-tight">
                Kiến Tạo <br /> <span className="italic">Phong Cách Mới</span>
              </h2>
              <div className="space-y-6 font-body text-lg text-primary max-w-md leading-relaxed">
                <p>ATELIER là nơi hội tụ giữa nghệ thuật thời trang truyền thống và thẩm mỹ hiện đại.</p>
                <p>Chúng tôi tin rằng sự sang trọng không nằm ở sự xa hoa, mà ở sự tinh tế trong từng đường nét, nguồn gốc của từng sợi vải.</p>
              </div>
              <div className="mt-12">
                <Link
                  to="/collections"
                  className="inline-block border-b border-primary pb-2 font-label text-sm uppercase tracking-widest text-primary hover:text-on-background hover:border-on-background transition-colors duration-300"
                >
                  Khám Phá Bộ Sưu Tập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-40 text-center bg-surface">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="font-headline text-4xl md:text-6xl text-on-background mb-10">Bắt Đầu Hành Trình</h2>
          <p className="font-body text-xl text-secondary mb-14 max-w-xl mx-auto">
            Đăng ký thành viên để nhận ưu đãi độc quyền và trải nghiệm mua sắm hoàn hảo.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-5">
            <Link
              to="/collections"
              className="bg-primary text-on-primary px-12 py-5 font-label text-sm uppercase tracking-[0.2em] hover:bg-on-background transition-colors duration-500 w-full md:w-auto text-center"
            >
              Mua Sắm Ngay
            </Link>
            <Link
              to="/register"
              className="bg-surface-container-lowest text-primary border border-outline-variant px-12 py-5 font-label text-sm uppercase tracking-[0.2em] hover:bg-surface-container transition-colors duration-500 w-full md:w-auto text-center"
            >
              Đăng Ký Thành Viên
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
