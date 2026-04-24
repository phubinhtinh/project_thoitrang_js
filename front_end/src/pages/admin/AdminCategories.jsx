import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { categoriesAPI } from '../../api/axios';

const emptyForm = { name: '', description: '', parentId: '' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    categoriesAPI
      .getAll()
      .then((res) => setCategories(res.data || []))
      .catch(() => toast.error('Không tải được danh mục'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const flatten = (cats, depth = 0) => {
    const out = [];
    cats.forEach((c) => {
      out.push({ ...c, depth });
      if (c.children?.length) out.push(...flatten(c.children, depth + 1));
    });
    return out;
  };

  const flat = flatten(categories);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({
      name: c.name || '',
      description: c.description || '',
      parentId: c.parentId || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Vui lòng nhập tên danh mục');
      return;
    }
    const payload = {
      name: form.name,
      description: form.description || undefined,
      parentId: form.parentId ? Number(form.parentId) : undefined,
    };
    setSaving(true);
    try {
      if (editingId) {
        await categoriesAPI.update(editingId, payload);
        toast.success('Đã cập nhật');
      } else {
        await categoriesAPI.create(payload);
        toast.success('Đã tạo danh mục');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Xóa danh mục "${c.name}"?`)) return;
    try {
      await categoriesAPI.remove(c.id);
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
          <h2 className="font-headline text-3xl md:text-4xl text-on-background">Danh mục</h2>
          <p className="font-body text-sm text-secondary mt-2">
            Cây danh mục sản phẩm hỗ trợ phân cấp cha-con.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 font-label text-xs uppercase tracking-widest hover:bg-on-background transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Thêm danh mục
        </button>
      </div>

      <div className="bg-surface border border-outline-variant/30 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low">
            <tr className="font-label text-[10px] uppercase tracking-widest text-secondary">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Mô tả</th>
              <th className="px-4 py-3">Danh mục cha</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-secondary text-sm">
                  Đang tải...
                </td>
              </tr>
            )}
            {!loading && flat.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-secondary text-sm">
                  Chưa có danh mục nào.
                </td>
              </tr>
            )}
            {flat.map((c) => {
              const parent = flat.find((x) => x.id === c.parentId);
              return (
                <tr key={c.id} className="hover:bg-surface-container-low/50">
                  <td className="px-4 py-3 font-label text-xs text-secondary">{c.id}</td>
                  <td className="px-4 py-3 font-body text-sm text-on-surface">
                    <span style={{ paddingLeft: `${c.depth * 16}px` }}>
                      {c.depth > 0 && <span className="text-outline mr-2">└─</span>}
                      {c.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-on-surface-variant max-w-[300px] truncate">
                    {c.description || '—'}
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-on-surface-variant">
                    {parent?.name || '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(c)}
                      className="text-primary hover:text-on-background mr-3"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      className="text-error hover:opacity-70"
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <form onSubmit={handleSubmit} className="bg-surface max-w-lg w-full">
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
              <h3 className="font-headline text-xl text-on-background">
                {editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-on-surface-variant"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="font-label text-[10px] uppercase tracking-widest text-secondary">
                  Tên *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-outline-variant bg-surface-container-low font-body text-sm"
                />
              </div>
              <div>
                <label className="font-label text-[10px] uppercase tracking-widest text-secondary">
                  Danh mục cha
                </label>
                <select
                  value={form.parentId}
                  onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-outline-variant bg-surface-container-low font-body text-sm"
                >
                  <option value="">-- Không có --</option>
                  {flat
                    .filter((c) => c.id !== editingId)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {'— '.repeat(c.depth)}
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="font-label text-[10px] uppercase tracking-widest text-secondary">
                  Mô tả
                </label>
                <textarea
                  rows={3}
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
                className="px-5 py-2.5 font-label text-xs uppercase tracking-widest text-on-surface-variant"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-primary text-on-primary px-6 py-2.5 font-label text-xs uppercase tracking-widest hover:bg-on-background disabled:opacity-50"
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
