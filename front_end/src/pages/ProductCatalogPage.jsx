import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../api/axios';

export default function ProductCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const currentCategory = searchParams.get('category') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    categoriesAPI.getAll().then(res => setCategories(res.data || [])).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page: currentPage, limit: 12 };
    if (currentCategory) params.category_id = currentCategory;

    productsAPI.getAll(params)
      .then(res => {
        setProducts(res.data.data || []);
        setPagination(res.data.pagination || {});
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentCategory, currentPage]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleCategoryClick = (catId) => {
    if (catId === currentCategory) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const handlePageChange = (page) => {
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Flatten categories for sidebar
  const flatCategories = [];
  categories.forEach(cat => {
    flatCategories.push(cat);
    if (cat.children) {
      cat.children.forEach(child => {
        flatCategories.push({ ...child, isChild: true });
        if (child.children) {
          child.children.forEach(grandChild => flatCategories.push({ ...grandChild, isChild: true, isGrandChild: true }));
        }
      });
    }
  });

  return (
    <div className="pt-28 md:pt-32 pb-24 px-6 md:px-8 max-w-[1920px] mx-auto">
      {/* Header */}
      <header className="mb-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <p className="font-label text-xs tracking-[0.3em] uppercase text-secondary mb-4">Bộ Sưu Tập</p>
            <h1 className="font-headline text-4xl md:text-6xl font-light tracking-tight text-on-background leading-tight">
              Tất Cả Sản Phẩm
            </h1>
          </div>
          <div className="flex items-center gap-8 border-b border-outline-variant/30 pb-4">
            <div className="font-label text-[11px] uppercase tracking-widest text-secondary">
              {pagination.total} sản phẩm
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Sidebar */}
        <aside className="w-full lg:w-56 flex-shrink-0 space-y-10">
          <section>
            <h3 className="font-headline text-lg mb-5">Danh Mục</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => {
                    searchParams.delete('category');
                    searchParams.set('page', '1');
                    setSearchParams(searchParams);
                  }}
                  className={`font-label text-sm transition-colors w-full text-left ${!currentCategory ? 'text-primary font-medium' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  Tất cả
                </button>
              </li>
              {flatCategories.map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.id.toString())}
                    className={`font-label text-sm transition-colors w-full text-left flex items-center justify-between ${cat.isChild ? 'pl-4' : ''} ${cat.isGrandChild ? 'pl-8' : ''} ${
                      currentCategory === cat.id.toString()
                        ? 'text-primary font-medium'
                        : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {cat.name}
                    {currentCategory === cat.id.toString() && <span className="w-1 h-1 bg-primary rounded-full" />}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-14">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-surface-container-high mb-5" />
                  <div className="h-4 bg-surface-container-high w-3/4 mb-2" />
                  <div className="h-3 bg-surface-container-high w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">inventory_2</span>
              <p className="font-body text-lg text-secondary">Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-14">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] bg-surface-container overflow-hidden mb-5">
                      {product.img ? (
                        <img
                          src={product.img}
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
                          <span className="font-label text-[10px] uppercase tracking-widest">Sale</span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white/80 hover:text-white transition-colors drop-shadow-md">favorite</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-headline text-lg mb-1 group-hover:opacity-70 transition-opacity line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                          {product.category?.name}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        {product.discountPrice ? (
                          <>
                            <span className="font-label text-sm text-error">{formatPrice(product.discountPrice)}</span>
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

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <nav className="mt-20 flex items-center justify-center space-x-6">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="material-symbols-outlined text-secondary hover:text-primary transition-colors disabled:opacity-30"
                  >
                    chevron_left
                  </button>
                  <div className="flex items-center space-x-4">
                    {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`font-label text-sm transition-colors ${
                            page === currentPage
                              ? 'text-primary border-b border-primary pb-1 font-medium'
                              : 'text-on-surface-variant hover:text-primary'
                          }`}
                        >
                          {String(page).padStart(2, '0')}
                        </button>
                      );
                    })}
                    {pagination.totalPages > 5 && (
                      <>
                        <span className="text-on-surface-variant">...</span>
                        <button
                          onClick={() => handlePageChange(pagination.totalPages)}
                          className="font-label text-sm text-on-surface-variant hover:text-primary"
                        >
                          {String(pagination.totalPages).padStart(2, '0')}
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= pagination.totalPages}
                    className="material-symbols-outlined text-secondary hover:text-primary transition-colors disabled:opacity-30"
                  >
                    chevron_right
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
