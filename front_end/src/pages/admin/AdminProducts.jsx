import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { productsAPI, categoriesAPI, colorsAPI, variantsAPI } from '../../api/axios';
import ImageUpload from '../../components/ImageUpload';

const emptyForm = { name: '', description: '', categoryId: '', basePrice: '', discountPrice: '' };

const emptyVariant = () => ({ _key: Math.random().toString(36).slice(2), id: null, size: '', stockQuantity: 0, sku: '' });

const emptyColor = () => ({ _key: Math.random().toString(36).slice(2), id: null, name: '', img: '', variants: [emptyVariant()] });

const formatVND = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(v) || 0);

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [colors, setColors] = useState([emptyColor()]);
  const [originalColorIds, setOriginalColorIds] = useState([]);
  const [originalVariantIds, setOriginalVariantIds] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    productsAPI.getAll({ limit: 200, search: search || undefined })
      .then((res) => setProducts(res.data.data || []))
      .catch(() => toast.error('Không tải được sản phẩm'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); categoriesAPI.getAll().then((res) => setCategories(res.data || [])); }, []);

  const flatCategories = (cats, depth = 0) => {
    const out = [];
    cats.forEach((c) => { out.push({ ...c, depth }); if (c.children?.length) out.push(...flatCategories(c.children, depth + 1)); });
    return out;
  };

  const openCreate = () => {
    setEditingId(null); setForm(emptyForm); setColors([emptyColor()]);
    setOriginalColorIds([]); setOriginalVariantIds([]); setModalOpen(true);
  };

  const openEdit = async (p) => {
    setEditingId(p.id);
    setForm({ name: p.name || '', description: p.description || '', categoryId: p.categoryId || p.category?.id || '', basePrice: p.basePrice || '', discountPrice: p.discountPrice || '' });
    try {
      const res = await colorsAPI.getByProduct(p.id);
      const list = (res.data || []).map((c) => ({
        _key: `db-${c.id}`, id: c.id, name: c.name || '', img: c.img || '',
        variants: (c.variants || []).map((v) => ({ _key: `db-${v.id}`, id: v.id, size: v.size || '', stockQuantity: v.stockQuantity ?? 0, sku: v.sku || '' })),
      }));
      setColors(list.length ? list : [emptyColor()]);
      setOriginalColorIds(list.map((c) => c.id));
      setOriginalVariantIds(list.flatMap((c) => c.variants.filter((v) => v.id).map((v) => v.id)));
    } catch {
      setColors([emptyColor()]); setOriginalColorIds([]); setOriginalVariantIds([]);
    }
    setModalOpen(true);
  };

  // Color helpers
  const updateColorField = (colorKey, field, value) => {
    setColors((cs) => cs.map((c) => (c._key === colorKey ? { ...c, [field]: value } : c)));
  };
  const addColorRow = () => setColors((cs) => [...cs, emptyColor()]);
  const removeColorRow = (colorKey) => setColors((cs) => (cs.length === 1 ? cs : cs.filter((c) => c._key !== colorKey)));

  // Variant helpers within a color
  const updateVariantField = (colorKey, variantKey, field, value) => {
    setColors((cs) => cs.map((c) => c._key === colorKey ? { ...c, variants: c.variants.map((v) => v._key === variantKey ? { ...v, [field]: value } : v) } : c));
  };
  const addVariantRow = (colorKey) => {
    setColors((cs) => cs.map((c) => c._key === colorKey ? { ...c, variants: [...c.variants, emptyVariant()] } : c));
  };
  const removeVariantRow = (colorKey, variantKey) => {
    setColors((cs) => cs.map((c) => c._key === colorKey ? { ...c, variants: c.variants.length === 1 ? c.variants : c.variants.filter((v) => v._key !== variantKey) } : c));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.categoryId || !form.basePrice) { toast.error('Vui lòng nhập tên, danh mục và giá'); return; }

    // Validate colors
    const cleanColors = colors.map((c) => ({
      ...c, name: c.name.trim(), img: c.img?.trim() || '',
      variants: c.variants.map((v) => ({ ...v, size: v.size.trim(), sku: v.sku.trim(), stockQuantity: Number(v.stockQuantity) || 0 })).filter((v) => v.size || v.sku),
    })).filter((c) => c.name);

    if (cleanColors.length === 0) { toast.error('Vui lòng nhập ít nhất 1 màu'); return; }
    for (const c of cleanColors) {
      if (c.variants.length === 0) { toast.error(`Màu "${c.name}" phải có ít nhất 1 size`); return; }
      for (const v of c.variants) {
        if (!v.size || !v.sku) { toast.error(`Mỗi size trong màu "${c.name}" cần có size và SKU`); return; }
      }
    }
    const allSkus = cleanColors.flatMap((c) => c.variants.map((v) => v.sku));
    if (new Set(allSkus).size !== allSkus.length) { toast.error('SKU không được trùng nhau'); return; }

    const basePayload = { name: form.name, description: form.description || undefined, categoryId: Number(form.categoryId), basePrice: Number(form.basePrice), discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined };

    setSaving(true);
    try {
      if (editingId) {
        await productsAPI.update(editingId, basePayload);
        // Sync colors
        const keepColorIds = cleanColors.filter((c) => c.id).map((c) => c.id);
        const toDeleteColors = originalColorIds.filter((id) => !keepColorIds.includes(id));
        await Promise.all(toDeleteColors.map((id) => colorsAPI.remove(id).catch(() => null)));

        for (const c of cleanColors) {
          if (c.id) {
            await colorsAPI.update(c.id, { name: c.name, img: c.img || undefined });
            // Sync variants within this color
            const keepVarIds = c.variants.filter((v) => v.id).map((v) => v.id);
            const origVarsForColor = originalVariantIds.filter((vid) => {
              const orig = colors.find((oc) => oc.id === c.id);
              return orig?.variants.some((ov) => ov.id === vid);
            });
            const toDeleteVars = origVarsForColor.filter((id) => !keepVarIds.includes(id));
            await Promise.all(toDeleteVars.map((id) => variantsAPI.remove(id).catch(() => null)));
            for (const v of c.variants) {
              const body = { size: v.size, stockQuantity: v.stockQuantity, sku: v.sku };
              if (v.id) { await variantsAPI.update(v.id, body); } else { await variantsAPI.create(c.id, body); }
            }
          } else {
            await colorsAPI.create(editingId, { name: c.name, img: c.img || undefined, variants: c.variants.map((v) => ({ size: v.size, stockQuantity: v.stockQuantity, sku: v.sku })) });
          }
        }
      } else {
        await productsAPI.create({
          ...basePayload,
          colors: cleanColors.map((c) => ({ name: c.name, img: c.img || undefined, variants: c.variants.map((v) => ({ size: v.size, stockQuantity: v.stockQuantity, sku: v.sku })) })),
        });
      }
      toast.success(editingId ? 'Đã cập nhật sản phẩm' : 'Đã tạo sản phẩm');
      setModalOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Thao tác thất bại'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Xóa sản phẩm "${p.name}"?`)) return;
    try { await productsAPI.remove(p.id); toast.success('Đã xóa'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Không thể xóa'); }
  };

  // Lấy ảnh đại diện: ảnh của color đầu tiên
  const getProductThumb = (p) => p.colors?.[0]?.img || null;
  // Tổng kho: tổng tất cả variants trong tất cả colors
  const getStock = (p) => p.colors?.reduce((s, c) => s + (c.variants?.reduce((s2, v) => s2 + (v.stockQuantity || 0), 0) || 0), 0) || 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline text-3xl md:text-4xl text-on-background">Sản phẩm</h2>
          <p className="font-body text-sm text-secondary mt-2">Quản lý danh sách sản phẩm trong cửa hàng.</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 font-label text-xs uppercase tracking-widest hover:bg-on-background transition-colors">
          <span className="material-symbols-outlined text-[18px]">add</span> Thêm sản phẩm
        </button>
      </div>

      {/* Search & Table */}
      <div className="bg-surface border border-outline-variant/30">
        <div className="p-4 border-b border-outline-variant/30 flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary">search</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()} placeholder="Tìm theo tên..." className="flex-1 bg-transparent outline-none font-body text-sm" />
          <button onClick={load} className="font-label text-xs uppercase tracking-widest text-primary hover:text-on-background">Tìm</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low">
              <tr className="font-label text-[10px] uppercase tracking-widest text-secondary">
                <th className="px-4 py-3">#</th><th className="px-4 py-3">Sản phẩm</th><th className="px-4 py-3">Danh mục</th><th className="px-4 py-3">Giá</th><th className="px-4 py-3">Kho</th><th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading && <tr><td colSpan={6} className="px-4 py-10 text-center text-secondary text-sm">Đang tải...</td></tr>}
              {!loading && products.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-secondary text-sm">Không có sản phẩm nào.</td></tr>}
              {products.map((p) => {
                const thumb = getProductThumb(p);
                const stock = getStock(p);
                const colorCount = p.colors?.length || 0;
                return (
                  <tr key={p.id} className="hover:bg-surface-container-low/50">
                    <td className="px-4 py-3 font-label text-xs text-secondary">{p.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-[240px]">
                        <div className="w-12 h-12 bg-surface-variant flex-shrink-0 overflow-hidden">
                          {thumb ? <img src={thumb} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-outline"><span className="material-symbols-outlined text-sm">image</span></div>}
                        </div>
                        <div className="min-w-0">
                          <p className="font-body text-sm text-on-surface truncate max-w-[280px]">{p.name}</p>
                          <p className="font-label text-[10px] uppercase tracking-wider text-secondary mt-0.5">{colorCount} màu</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-on-surface-variant">{p.category?.name || '—'}</td>
                    <td className="px-4 py-3 font-label text-sm">
                      {p.discountPrice ? (<><span className="text-error">{formatVND(p.discountPrice)}</span><span className="block text-[10px] text-outline line-through">{formatVND(p.basePrice)}</span></>) : <span className="text-on-surface">{formatVND(p.basePrice)}</span>}
                    </td>
                    <td className="px-4 py-3 font-label text-sm"><span className={stock === 0 ? 'text-error' : stock < 10 ? 'text-secondary' : 'text-on-surface'}>{stock}</span></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(p)} className="text-primary hover:text-on-background mr-3" title="Sửa"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                      <button onClick={() => handleDelete(p)} className="text-error hover:opacity-70" title="Xóa"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <form onSubmit={handleSubmit} className="bg-surface max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
              <h3 className="font-headline text-xl text-on-background">{editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Basic fields */}
              <div>
                <label className="font-label text-[10px] uppercase tracking-widest text-secondary">Tên sản phẩm *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 px-3 py-2 border border-outline-variant bg-surface-container-low focus:border-primary outline-none font-body text-sm" />
              </div>
              <div>
                <label className="font-label text-[10px] uppercase tracking-widest text-secondary">Danh mục *</label>
                <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full mt-1 px-3 py-2 border border-outline-variant bg-surface-container-low font-body text-sm">
                  <option value="">-- Chọn danh mục --</option>
                  {flatCategories(categories).map((c) => <option key={c.id} value={c.id}>{'— '.repeat(c.depth)}{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label text-[10px] uppercase tracking-widest text-secondary">Giá gốc *</label>
                  <input required type="number" min="0" step="1000" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} className="w-full mt-1 px-3 py-2 border border-outline-variant bg-surface-container-low font-body text-sm" />
                </div>
                <div>
                  <label className="font-label text-[10px] uppercase tracking-widest text-secondary">Giá khuyến mãi</label>
                  <input type="number" min="0" step="1000" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="w-full mt-1 px-3 py-2 border border-outline-variant bg-surface-container-low font-body text-sm" />
                </div>
              </div>
              <div>
                <label className="font-label text-[10px] uppercase tracking-widest text-secondary">Mô tả</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full mt-1 px-3 py-2 border border-outline-variant bg-surface-container-low font-body text-sm resize-none" />
              </div>

              {/* Colors Section */}
              <div className="pt-4 border-t border-outline-variant/30">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-label text-[10px] uppercase tracking-widest text-secondary">Màu sắc & Size *</label>
                  <button type="button" onClick={addColorRow} className="inline-flex items-center gap-1 text-primary hover:text-on-background font-label text-[11px] uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[16px]">add</span> Thêm màu
                  </button>
                </div>

                <div className="space-y-4">
                  {colors.map((color, cIdx) => (
                    <div key={color._key} className="border border-outline-variant/40 bg-surface-container-low/50">
                      {/* Color header */}
                      <div className="flex items-center justify-between px-4 py-3 bg-surface-container-low border-b border-outline-variant/20">
                        <span className="font-label text-[10px] uppercase tracking-widest text-secondary">🎨 Màu #{cIdx + 1}</span>
                        <button type="button" onClick={() => removeColorRow(color._key)} disabled={colors.length === 1} className="inline-flex items-center gap-1 text-error hover:opacity-70 disabled:opacity-25 disabled:cursor-not-allowed font-label text-[10px] uppercase tracking-widest" title="Xóa màu">
                          <span className="material-symbols-outlined text-[16px]">delete</span> Xóa
                        </button>
                      </div>
                      <div className="p-4 space-y-3">
                        {/* Color name + image */}
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <label className="font-label text-[9px] uppercase tracking-widest text-secondary block mb-1">Tên màu *</label>
                            <input placeholder="Xanh Navy, Đen, Trắng..." value={color.name} onChange={(e) => updateColorField(color._key, 'name', e.target.value)} className="w-full px-2.5 py-2 border border-outline-variant bg-surface font-body text-sm" />
                          </div>
                          <div>
                            <label className="font-label text-[9px] uppercase tracking-widest text-secondary block mb-1">Ảnh màu</label>
                            <ImageUpload value={color.img} onChange={(url) => updateColorField(color._key, 'img', url)} size="sm" />
                          </div>
                        </div>

                        {/* Variants (Sizes) within this color */}
                        <div className="pl-4 border-l-2 border-primary/20 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-label text-[9px] uppercase tracking-widest text-secondary">Các size</span>
                            <button type="button" onClick={() => addVariantRow(color._key)} className="inline-flex items-center gap-1 text-primary hover:text-on-background font-label text-[10px] uppercase tracking-widest">
                              <span className="material-symbols-outlined text-[14px]">add</span> Thêm size
                            </button>
                          </div>
                          {color.variants.map((v, vIdx) => (
                            <div key={v._key} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
                              <div>
                                <label className="font-label text-[8px] uppercase tracking-widest text-secondary block mb-0.5">Size *</label>
                                <input placeholder="S, M, L..." value={v.size} onChange={(e) => updateVariantField(color._key, v._key, 'size', e.target.value)} className="w-full px-2 py-1.5 border border-outline-variant bg-surface font-body text-sm" />
                              </div>
                              <div>
                                <label className="font-label text-[8px] uppercase tracking-widest text-secondary block mb-0.5">Tồn kho</label>
                                <input type="number" min="0" placeholder="0" value={v.stockQuantity} onChange={(e) => updateVariantField(color._key, v._key, 'stockQuantity', e.target.value)} className="w-full px-2 py-1.5 border border-outline-variant bg-surface font-body text-sm" />
                              </div>
                              <div>
                                <label className="font-label text-[8px] uppercase tracking-widest text-secondary block mb-0.5">SKU *</label>
                                <input placeholder="Mã duy nhất" value={v.sku} onChange={(e) => updateVariantField(color._key, v._key, 'sku', e.target.value)} className="w-full px-2 py-1.5 border border-outline-variant bg-surface font-body text-sm" />
                              </div>
                              <button type="button" onClick={() => removeVariantRow(color._key, v._key)} disabled={color.variants.length === 1} className="text-error hover:opacity-70 disabled:opacity-25 disabled:cursor-not-allowed pb-1" title="Xóa size">
                                <span className="material-symbols-outlined text-[18px]">close</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="font-body text-[11px] text-secondary mt-2">Mỗi màu có thể chứa nhiều size. SKU phải duy nhất trong toàn hệ thống.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-outline-variant/30 flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface">Hủy</button>
              <button type="submit" disabled={saving} className="bg-primary text-on-primary px-6 py-2.5 font-label text-xs uppercase tracking-widest hover:bg-on-background disabled:opacity-50 transition-colors">
                {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
