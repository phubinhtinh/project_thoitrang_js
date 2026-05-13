import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { uploadAPI } from '../api/axios';

/**
 * Component upload ảnh từ máy.
 * @param {string} value - URL ảnh hiện tại
 * @param {(url: string) => void} onChange - Callback khi upload xong (nhận URL mới)
 * @param {'lg'|'sm'} [size='lg'] - Kích thước preview
 */
const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB — chặn file bất thường
const MAX_DIMENSION = 1200; // px
const JPEG_QUALITY = 0.85;

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width >= height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error('Không thể nén ảnh')); return; }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
        },
        'image/jpeg',
        JPEG_QUALITY,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Ảnh không hợp lệ')); };
    img.src = url;
  });
}

export default function ImageUpload({ value, onChange, size = 'lg' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    if (file.size > MAX_SIZE_BYTES) {
      toast.error('File quá lớn (tối đa 50MB)');
      return;
    }
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const res = await uploadAPI.uploadImage(compressed);
      onChange(res.data.url);
      toast.success('Đã tải ảnh lên');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Tải ảnh lên thất bại');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const dims = size === 'sm' ? 'w-16 h-16' : 'w-32 h-32';

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${dims} flex-shrink-0 bg-surface-container-low border border-outline-variant/40 overflow-hidden flex items-center justify-center`}
      >
        {value ? (
          <img src={value} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="material-symbols-outlined text-outline-variant text-3xl">image</span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant bg-surface hover:bg-surface-container-low font-label text-[11px] uppercase tracking-widest disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px]">upload</span>
          {uploading ? 'Đang tải...' : value ? 'Thay ảnh' : 'Chọn ảnh'}
        </button>
        {value && !uploading && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="font-label text-[10px] uppercase tracking-widest text-error hover:opacity-70 self-start"
          >
            Xóa ảnh
          </button>
        )}
      </div>
    </div>
  );
}
