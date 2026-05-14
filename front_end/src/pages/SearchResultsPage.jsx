import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productsAPI } from '../api/axios';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0 });
  const [loading, setLoading] = useState(false);
  const searchQuery = searchParams.get('q') || '';

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setProducts([]); return; }
    setLoading(true);
    try {
      const res = await productsAPI.getAll({ search: q, limit: 12 });
      setProducts(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (searchQuery) { setQuery(searchQuery); doSearch(searchQuery); } }, [searchQuery, doSearch]);

  const handleSearch = (e) => { e.preventDefault(); if (query.trim()) setSearchParams({ q: query.trim() }); };

  const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  return (
    <div className="pt-40 md:pt-48 pb-24">
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-20">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="font-headline text-4xl md:text-5xl text-on-surface mb-10">Tìm kiếm</h1>
          <form onSubmit={handleSearch} className="w-full relative group">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline pointer-events-none">search</span>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập tên sản phẩm, thương hiệu..."
              className="w-full bg-surface border border-outline-variant/40 focus:border-primary text-on-surface placeholder:text-outline pl-14 pr-14 py-5 text-lg font-body outline-none transition-colors rounded-sm"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setSearchParams({}); setProducts([]); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </form>
          {searchQuery && <p className="mt-6 font-label text-[11px] uppercase tracking-[0.2em] text-secondary">{loading ? 'Đang tìm...' : `${pagination.total || 0} kết quả cho '${searchQuery}'`}</p>}
        </div>
      </section>
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">{[...Array(6)].map((_, i) => <div key={i} className="animate-pulse"><div className="aspect-[3/4] bg-surface-container-high mb-5"/><div className="h-4 bg-surface-container-high w-3/4 mb-2"/></div>)}</div>
        ) : products.length === 0 && searchQuery ? (
          <div className="text-center py-20"><span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">search_off</span><p className="font-body text-lg text-secondary">Không tìm thấy sản phẩm nào</p></div>
        ) : !searchQuery ? (
          <div className="text-center py-20"><span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">search</span><p className="font-body text-lg text-secondary">Nhập từ khóa để tìm kiếm</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {products.map((p) => (
              <Link key={p.id} to={`/products/${p.id}`} className="group cursor-pointer">
                <div className="relative aspect-[3/4] bg-surface-variant overflow-hidden mb-5">
                  {p.colors?.[0]?.img ? <img src={p.colors[0].img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/> : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-4xl text-outline-variant">image</span></div>}
                </div>
                <div className="flex justify-between items-start">
                  <div><h2 className="font-body text-sm font-medium line-clamp-1">{p.name}</h2><span className="font-label text-xs text-secondary">{p.category?.name}</span></div>
                  <span className="font-body text-sm text-on-surface ml-4">{p.discountPrice ? fmt(p.discountPrice) : fmt(p.basePrice)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
