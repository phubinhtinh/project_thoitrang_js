import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { productsAPI, categoriesAPI, colorsAPI, variantsAPI } from '../../api/axios';
import ImageUpload from '../../components/ImageUpload';

const emptyForm = {
  name: '',
  description: '',
  categoryId: '',
  basePrice: '',
  discountPrice: '',
};

const rand = () => Math.random().toString(36).slice(2);
const emptyVariantRow = () => ({ _key: rand(), id: null, size: '', sku: '', stockQuantity: 0 });
const emptyColorGroup = () => ({ _key: rand(), id: null, color: '', img: '', variants: [emptyVariantRow()] });

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
  const [colorGroups, setColorGroups] = useState([emptyColorGroup()]);
  const [originalColorIds, setOriginalColorIds] = useState([]);
  const [originalVariantIds, setOriginalVariantIds] = useState([]);
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
    setColorGroups([emptyColorGroup()]);
    setOriginalColorIds([]);
    setOriginalVariantIds([]);
    setModalOpen(true);
  };

  const openEdit = async (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || '',
      description: p.description || '',
      categoryId: p.categoryId || p.category?.id || '',
      basePrice: p.basePrice || '',
      discountPrice: p.discountPrice || '',
    });
    try {
      const res = await colorsAPI.getByProduct(p.id);
      const list = (res.data || []).map((c) => ({
        _key: `db-color-${c.id}`,
        id: c.id,
        color: c.color || '',
        img: c.img || '',
        variants: (c.variants || []).map((v) => ({
          _key: `db-var-${v.id}`,
          id: v.id,
          size: v.size || '',
          sku: v.sku || '',
          stockQuantity: v.stockQuantity ?? 0,
        })),
      }));
      // Đảm bảo mỗi color có ít nhất 1 variant row
      list.forEach((c) => { if (!c.variants.length) c.variants.push(emptyVariantRow()); });
      setColorGroups(list.length ? list : [emptyColorGroup()]);
      setOriginalColorIds(list.map((c) => c.id).filter(Boolean));
      setOriginalVariantIds(list.flatMap((c) => c.variants.map((v) => v.id)).filter(Boolean));
    } catch {
      setColorGroups([emptyColorGroup()]);
      setOriginalColorIds([]);
      setOriginalVariantIds([]);
    }
    setModalOpen(true);
  };

  // Color group helpers
  const addColorGroup = () => setColorGroups((gs) => [...gs, emptyColorGroup()]);
  const removeColorGroup = (key) => {
    setColorGroups((gs) => (gs.length === 1 ? gs : gs.filter((g) => g._key !== key)));
  };
  const updateColorField = (key, field, value) => {
    setColorGroups((gs) => gs.map((g) => (g._key === key ? { ...g, [field]: value } : g)));
  };

  // Variant row helpers (within a color group)
  const addVariantRow = (colorKey) => {
    setColorGroups((gs) =>
      gs.map((g) => (g._key === colorKey ? { ...g, variants: [...g.variants, emptyVariantRow()] } : g))
    );
  };
  const removeVariantRow = (colorKey, varKey) => {
    setColorGroups((gs) =>
      gs.map((g) =>
        g._key === colorKey
          ? { ...g, variants: g.variants.length === 1 ? g.variants : g.variants.filter((v) => v._key !== varKey) }
          : g
      )
    );
  };
  const updateVariantField = (colorKey, varKey, field, value) => {
    setColorGroups((gs) =>
      gs.map((g) =>
        g._key === colorKey
          ? { ...g, variants: g.variants.map((v) => (v._key === varKey ? { ...v, [field]: value } : v)) }
          : g
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.categoryId || !form.basePrice) {
      toast.error('Vui lòng nhập tên, danh mục và giá');
      return;
    }

    // Validate color groups
    const cleanGroups = colorGroups.map((g) => ({
      ...g,
      color: g.color.trim(),
      img: g.img?.trim() || '',
      variants: g.variants
        .map((v) => ({ ...v, size: v.size.trim(), sku: v.sku.trim(), stockQuantity: Number(v.stockQuantity) || 0 }))
        .filter((v) => v.size || v.sku),
    })).filter((g) => g.color || g.variants.length > 0);

    if (cleanGroups.length === 0) {
      toast.error('Vui lòng nhập ít nhất 1 màu');
      return;
    }
    for (const g of cleanGroups) {
      if (!g.color) { toast.error('Mỗi nhóm phải có tên màu'); return; }
      if (!g.img) { toast.error(`Màu "${g.color}" chưa có ảnh`); return; }
      if (g.variants.length === 0) { toast.error(`Màu "${g.color}" phải có ít nhất 1 size`); return; }
      for (const v of g.variants) {
        if (!v.size || !v.sku) { toast.error(`Mỗi size trong màu "${g.color}" cần đủ size và SKU`); return; }
      }
    }
    const allSkus = cleanGroups.flatMap((g) => g.variants.map((v) => v.sku));
    if (new Set(allSkus).size !== allSkus.length) {
      toast.error('SKU các biến thể không được trùng nhau');
      return;
    }

    const basePayload = {
      name: form.name,
      description: form.description || undefined,
      categoryId: Number(form.categoryId),
      basePrice: Number(form.basePrice),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
    };

    setSaving(true);
    try {
      if (editingId) {
        // Cập nhật product info
        await productsAPI.update(editingId, basePayload);

        // Xóa colors/variants bị bỏ
        const keepColorIds = cleanGroups.filter((g) => g.id).map((g) => g.id);
        const keepVarIds = cleanGroups.flatMap((g) => g.variants.filter((v) => v.id).map((v) => v.id));
        const delVars = originalVariantIds.filter((id) => !keepVarIds.includes(id));
        const delColors = originalColorIds.filter((id) => !keepColorIds.includes(id));
        await Promise.all(delVars.map((id) => variantsAPI.remove(id).catch(() => null)));
        await Promise.all(delColors.map((id) => colorsAPI.remove(id).catch(() => null)));

        // Upsert từng color
        for (const g of cleanGroups) {
          let colorId = g.id;
          if (colorId) {
            await colorsAPI.update(colorId, { color: g.color, img: g.img });
          } else {
            // Tạo color mới kèm variants
            const newVariants = g.variants.filter((v) => !v.id);
            const existingVariants = g.variants.filter((v) => v.id);
            const res = await colorsAPI.create(editingId, {
              color: g.color,
              img: g.img,
              variants: newVariants.map((v) => ({ size: v.size, sku: v.sku, stockQuantity: v.stockQuantity })),
            });
            colorId = res.data.id;
            // Update existing variants nếu có (hiếm khi xảy ra)
            for (const v of existingVariants) {
              await variantsAPI.update(v.id, { size: v.size, sku: v.sku, stockQuantity: v.stockQuantity });
            }
            continue; // variants đã tạo cùng color
          }
          // Upsert variants cho color đã có
          for (const v of g.variants) {
            if (v.id) {
              await variantsAPI.update(v.id, { size: v.size, sku: v.sku, stockQuantity: v.stockQuantity });
            } else {
              await variantsAPI.create(colorId, { size: v.size, sku: v.sku, stockQuantity: v.stockQuantity });
            }
          }
        }
      } else {
        // Tạo mới: gửi product + colors + variants trong 1 request
        await productsAPI.create({
          ...basePayload,
          colors: cleanGroups.map((g) => ({
            color: g.color,
            img: g.img,
            variants: g.variants.map((v) => ({ size: v.size, stockQuantity: v.stockQuantity, sku: v.sku })),
          })),
        });
      }

      toast.success(editingId ? 'Đã cập nhật sản phẩm' : 'Đã tạo sản phẩm');
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
                const stock = p.colors?.flatMap(c => c.variants || []).reduce((s, v) => s + (v.stockQuantity || 0), 0) || 0;
                const colorCount = p.colors?.length || 0;
                const variantCount = p.colors?.flatMap(c => c.variants || []).length || 0;
                return (
                  <tr key={p.id} className="hover:bg-surface-container-low/50">
                    <td className="px-4 py-3 font-label text-xs text-secondary">{p.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-[240px]">
                        <div className="w-12 h-12 bg-surface-variant flex-shrink-0 overflow-hidden">
                          {p.colors?.[0]?.img ? (
                            <img src={p.colors[0].img} alt={p.name} className="w-full h-full object-cover" />
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
                            {colorCount} màu · {variantCount} biến thể
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
                      <span className={stock === 0 ? 'text-error' : stock < 10 ? 'text-secondary' : 'text-on-surface'}>
                        {stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(p)} className="text-primary hover:text-on-background mr-3" title="Sửa">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button onClick={() => handleDelete(p)} className="text-error hover:opacity-70" title="Xóa">
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
          <form onSubmit={handleSubmit} className="bg-surface max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
              <h3 className="font-headline text-xl text-on-background">
                {editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Product info fields */}
              <div>
                <label className="font-label text-[10px] uppercase tracking-widest text-secondary">Tên sản phẩm *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-outline-variant bg-surface-container-low focus:border-primary outline-none font-body text-sm" />
              </div>
              <div>
                <label className="font-label text-[10px] uppercase tracking-widest text-secondary">Danh mục *</label>
                <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-outline-variant bg-surface-container-low font-body text-sm">
                  <option value="">-- Chọn danh mục --</option>
                  {flatCategories(categories).map((c) => (
                    <option key={c.id} value={c.id}>{'— '.repeat(c.depth)}{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label text-[10px] uppercase tracking-widest text-secondary">Giá gốc *</label>
                  <input required type="number" min="0" step="1000" value={form.basePrice}
                    onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-outline-variant bg-surface-container-low font-body text-sm" />
                </div>
                <div>
                  <label className="font-label text-[10px] uppercase tracking-widest text-secondary">Giá khuyến mãi</label>
                  <input type="number" min="0" step="1000" value={form.discountPrice}
                    onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-outline-variant bg-surface-container-low font-body text-sm" />
                </div>
              </div>
              <div>
                <label className="font-label text-[10px] uppercase tracking-widest text-secondary">Mô tả</label>
                <textarea rows={3} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-outline-variant bg-surface-container-low font-body text-sm resize-none" />
              </div>

              {/* Color Groups */}
              <div className="pt-4 border-t border-outline-variant/30">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-label text-[10px] uppercase tracking-widest text-secondary">
                    Màu sắc & Biến thể *
                  </label>
                  <button type="button" onClick={addColorGroup}
                    className="inline-flex items-center gap-1 text-primary hover:text-on-background font-label text-[11px] uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Thêm màu
                  </button>
                </div>

                <div className="space-y-5">
                  {colorGroups.map((g, gIdx) => (
                    <div key={g._key} className="border border-outline-variant/40 bg-surface-container-low/50">
                      {/* Color header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20 bg-surface-container-low">
                        <span className="font-label text-[10px] uppercase tracking-widest text-secondary">
                          Màu #{gIdx + 1}
                        </span>
                        <button type="button" onClick={() => removeColorGroup(g._key)} disabled={colorGroups.length === 1}
                          className="inline-flex items-center gap-1 text-error hover:opacity-70 disabled:opacity-25 disabled:cursor-not-allowed font-label text-[10px] uppercase tracking-widest">
                          <span className="material-symbols-outlined text-[16px]">delete</span> Xóa màu
                        </button>
                      </div>

                      <div className="p-4 space-y-3">
                        {/* Color name + image */}
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <label className="font-label text-[9px] uppercase tracking-widest text-secondary block mb-1">Tên màu *</label>
                            <input placeholder="Đen, Đỏ, Xanh..." value={g.color}
                              onChange={(e) => updateColorField(g._key, 'color', e.target.value)}
                              className="w-full px-2.5 py-2 border border-outline-variant bg-surface font-body text-sm" />
                          </div>
                          <div className="flex-1">
                            <label className="font-label text-[9px] uppercase tracking-widest text-secondary block mb-1">Ảnh màu *</label>
                            <ImageUpload value={g.img} onChange={(url) => updateColorField(g._key, 'img', url)} size="sm" />
                          </div>
                        </div>

                        {/* Variant rows (sizes) */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-label text-[9px] uppercase tracking-widest text-secondary">Sizes</span>
                            <button type="button" onClick={() => addVariantRow(g._key)}
                              className="inline-flex items-center gap-0.5 text-primary font-label text-[10px] uppercase tracking-widest">
                              <span className="material-symbols-outlined text-[14px]">add</span> Thêm size
                            </button>
                          </div>
                          <div className="space-y-2">
                            {g.variants.map((v, vIdx) => (
                              <div key={v._key} className="flex items-center gap-2">
                                <input placeholder="S, M, L..." value={v.size}
                                  onChange={(e) => updateVariantField(g._key, v._key, 'size', e.target.value)}
                                  className="flex-1 px-2 py-1.5 border border-outline-variant bg-surface font-body text-sm" />
                                <input placeholder="SKU..." value={v.sku}
                                  onChange={(e) => updateVariantField(g._key, v._key, 'sku', e.target.value)}
                                  className="flex-1 px-2 py-1.5 border border-outline-variant bg-surface font-body text-sm" />
                                <input type="number" min="0" placeholder="Kho" value={v.stockQuantity}
                                  onChange={(e) => updateVariantField(g._key, v._key, 'stockQuantity', e.target.value)}
                                  className="w-20 px-2 py-1.5 border border-outline-variant bg-surface font-body text-sm" />
                                <button type="button" onClick={() => removeVariantRow(g._key, v._key)}
                                  disabled={g.variants.length === 1}
                                  className="text-error hover:opacity-70 disabled:opacity-25 disabled:cursor-not-allowed">
                                  <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="font-body text-[11px] text-secondary mt-2">
                  Mỗi màu có 1 ảnh đại diện. Mỗi size trong màu là 1 biến thể bán được. SKU phải duy nhất.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-outline-variant/30 flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface">
                Hủy
              </button>
              <button type="submit" disabled={saving}
                className="bg-primary text-on-primary px-6 py-2.5 font-label text-xs uppercase tracking-widest hover:bg-on-background disabled:opacity-50 transition-colors">
                {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
