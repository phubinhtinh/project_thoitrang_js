import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { productsAPI, categoriesAPI } from '../../api/axios';

const emptyForm = {
  name: '',
  description: '',
  categoryId: '',
  basePrice: '',
  discountPrice: '',
  img: '',
};

const formatVND = (v) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(v) || 0);

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    productsAPI
      .getAll({ limit: 200, search: search || undefined })
      .then((res) => setProducts(res.data.data || []))
      .catch(() => toast.error('Không tải được sản phẩm'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    categoriesAPI.getAll().then((res) => setCategories(res.data || []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flatCategories = (cats, depth = 0) => {
    const out = [];
    cats.forEach((c) => {
      out.push({ ...c, depth });
      if (c.children?.length) out.push(...flatCategories(c.children, depth + 1));
    });
    return out;
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || '',
      description: p.description || '',
      categoryId: p.categoryId || p.category?.id || '',
      basePrice: p.basePrice || '',
      discountPrice: p.discountPrice || '',
      img: p.img || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.categoryId || !form.basePrice) {
      toast.error('Vui lòng nhập tên, danh mục và giá');
      return;
    }
    const payload = {
      name: form.name,
      description: form.description || undefined,
      categoryId: Number(form.categoryId),
      basePrice: Number(form.basePrice),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      img: form.img || undefined,
    };
    setSaving(true);
    try {
      if (editingId) {
        await productsAPI.update(editingId, payload);
        toast.success('Đã cập nhật sản phẩm');
      } else {
        await productsAPI.create(payload);
        toast.success('Đã tạo sản phẩm');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Xóa sản phẩm "${p.name}"?`)) return;
    try {
      await productsAPI.remove(p.id);
      toast.success('Đã xóa');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể xóa');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline text-3xl md:text-4xl text-on-background">Sản phẩm</h2>
          <p className="font-body text-sm text-secondary mt-2">
            Quản lý danh sách sản phẩm trong cửa hàng.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 font-label text-xs uppercase tracking-widest hover:bg-on-background transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Thêm sản phẩm
        </button>
      </div>

      <div className="bg-surface border border-outline-variant/30">
        <div className="p-4 border-b border-outline-variant/30 flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            placeholder="Tìm theo tên..."
            className="flex-1 bg-transparent outline-none font-body text-sm"
          />
          <button
            onClick={load}
            className="font-label text-xs uppercase tracking-widest text-primary hover:text-on-background"
          >
            Tìm
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low">
              <tr className="font-label text-[10px] uppercase tracking-widest text-secondary">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Danh mục</th>
                <th className="px-4 py-3">Giá</th>
                <th className="px-4 py-3">Kho</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-secondary text-sm">
                    Đang tải...
                  </td>
                </tr>
              )}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-secondary text-sm">
                    Không có sản phẩm nào.
                  </td>
                </tr>
              )}
              {products.map((p) => {
                const stock = p.variants?.reduce((s, v) => s + (v.stockQuantity || 0), 0) || 0;
                return (
                  <tr key={p.id} className="hover:bg-surface-container-low/50">
                    <td className="px-4 py-3 font-label text-xs text-secondary">{p.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-[240px]">
                        <div className="w-12 h-12 bg-surface-variant flex-shrink-0 overflow-hidden">
                          {p.img ? (
                            <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-outline">
                              <span className="material-symbols-outlined text-sm">image</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-body text-sm text-on-surface truncate max-w-[280px]">
                            {p.name}
                          </p>
                          <p className="font-label text-[10px] uppercase tracking-wider text-secondary mt-0.5">
                            {p.variants?.length || 0} biến thể
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-on-surface-variant">
                      {p.category?.name || '—'}
                    </td>
                    <td className="px-4 py-3 font-label text-sm">
                      {p.discountPrice ? (
                        <>
                          <span className="text-error">{formatVND(p.discountPrice)}</span>
                          <span className="block text-[10px] text-outline line-through">
                            {formatVND(p.basePrice)}
                          </span>
                        </>
                      ) : (
                        <span className="text-on-surface">{formatVND(p.basePrice)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-label text-sm">
                      <span
                        className={
                          stock === 0 ? 'text-error' : stock < 10 ? 'text-secondary' : 'text-on-surface'
                        }
                      >
                        {stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEdit(p)}
                        className="text-primary hover:text-on-background mr-3"
                        title="Sửa"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="text-error hover:opacity-70"
                        title="Xóa"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <form
            onSubmit={handleSubmit}
            className="bg-surface max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
              <h3 className="font-headline text-xl text-on-background">
                {editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="font-label text-[10px] uppercase tracking-widest text-secondary">
                  Tên sản phẩm *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-outline-variant bg-surface-container-low focus:border-primary outline-none font-body text-sm"
                />
              </div>
              <div>
                <label className="font-label text-[10px] uppercase tracking-widest text-secondary">
                  Danh mục *
                </label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-outline-variant bg-surface-container-low font-body text-sm"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {flatCategories(categories).map((c) => (
                    <option key={c.id} value={c.id}>
                      {'— '.repeat(c.depth)}
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label text-[10px] uppercase tracking-widest text-secondary">
                    Giá gốc *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1000"
                    value={form.basePrice}
                    onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-outline-variant bg-surface-container-low font-body text-sm"
                  />
                </div>
                <div>
                  <label className="font-label text-[10px] uppercase tracking-widest text-secondary">
                    Giá khuyến mãi
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={form.discountPrice}
                    onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-outline-variant bg-surface-container-low font-body text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="font-label text-[10px] uppercase tracking-widest text-secondary">
                  URL hình ảnh
                </label>
                <input
                  value={form.img}
                  onChange={(e) => setForm({ ...form, img: e.target.value })}
                  placeholder="https://..."
                  className="w-full mt-1 px-3 py-2 border border-outline-variant bg-surface-container-low font-body text-sm"
                />
                {form.img && (
                  <img
                    src={form.img}
                    alt="preview"
                    className="mt-3 w-full max-h-48 object-cover border border-outline-variant/30"
                  />
                )}
              </div>
              <div>
                <label className="font-label text-[10px] uppercase tracking-widest text-secondary">
                  Mô tả
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-outline-variant bg-surface-container-low font-body text-sm resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-outline-variant/30 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-primary text-on-primary px-6 py-2.5 font-label text-xs uppercase tracking-widest hover:bg-on-background disabled:opacity-50 transition-colors"
              >
                {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
