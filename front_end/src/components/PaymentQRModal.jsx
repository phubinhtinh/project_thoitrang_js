import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { BANK_CONFIG, buildVietQRUrl } from '../config/bankConfig';
import { ordersAPI } from '../api/axios';

/**
 * Modal hiển thị mã QR VietQR + tự động polling trạng thái thanh toán.
 * Khi Casso webhook xác nhận tiền đã vào → hiển thị thành công.
 */
export default function PaymentQRModal({ open, orderId, amount, onClose }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const intervalRef = useRef(null);

  // Polling: kiểm tra trạng thái thanh toán mỗi 5 giây
  useEffect(() => {
    if (!open || !orderId || paymentConfirmed) return;

    const checkStatus = async () => {
      try {
        const res = await ordersAPI.getPaymentStatus(orderId);
        if (res.data?.paymentStatus === 'paid') {
          setPaymentConfirmed(true);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch {
        // Bỏ qua lỗi polling (network, 401...)
      }
    };

    // Kiểm tra ngay lập tức lần đầu
    checkStatus();
    // Sau đó kiểm tra mỗi 5 giây
    intervalRef.current = setInterval(checkStatus, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [open, orderId, paymentConfirmed]);

  // Auto-close sau 4 giây khi xác nhận thành công
  useEffect(() => {
    if (!paymentConfirmed) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [paymentConfirmed, onClose]);

  if (!open) return null;

  const addInfo = `THANHTOAN DH${orderId}`;
  const qrUrl = buildVietQRUrl({ amount, addInfo });

  const formatPrice = (p) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  const copy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  // === Màn hình THÀNH CÔNG ===
  if (paymentConfirmed) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/70 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-surface w-full max-w-md text-center p-12 shadow-2xl animate-scale-in">
          {/* Checkmark animation */}
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-100 flex items-center justify-center animate-bounce-in">
            <span className="material-symbols-outlined text-5xl text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
          <h2 className="font-headline text-3xl text-on-surface mb-3">
            Thanh toán thành công!
          </h2>
          <p className="font-body text-secondary mb-2">
            Đơn hàng <strong>#{orderId}</strong> đã được xác nhận thanh toán
          </p>
          <p className="font-label text-lg text-green-700 font-semibold mb-6">
            {formatPrice(amount)}
          </p>
          <p className="font-body text-xs text-secondary animate-pulse">
            Tự động chuyển hướng sau vài giây...
          </p>
        </div>
      </div>
    );
  }

  // === Màn hình QR (đang chờ thanh toán) ===
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 border-b border-outline-variant/20 flex items-center justify-between sticky top-0 bg-surface z-10">
          <div>
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary">Đơn hàng #{orderId}</p>
            <h2 className="font-headline text-2xl text-on-surface mt-1">Quét mã QR để chuyển khoản</h2>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface transition-colors"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* QR Image */}
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-square bg-surface-container-low border border-outline-variant/30 flex items-center justify-center overflow-hidden">
              {!imgLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-outline-variant animate-pulse">qr_code_2</span>
                </div>
              )}
              <img
                src={qrUrl}
                alt="VietQR"
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-contain p-4 transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
            <p className="font-label text-[10px] uppercase tracking-[0.25em] text-secondary mt-4 text-center">
              Mở app ngân hàng &middot; Quét QR &middot; Xác nhận
            </p>
          </div>

          {/* Bank Info */}
          <div className="flex flex-col gap-5">
            <InfoRow label="Ngân hàng" value={BANK_CONFIG.bankName} />
            <InfoRow label="Số tài khoản" value={BANK_CONFIG.accountNumber} onCopy={() => copy(BANK_CONFIG.accountNumber, 'số tài khoản')} />
            <InfoRow label="Chủ tài khoản" value={BANK_CONFIG.accountName} />
            <InfoRow label="Số tiền" value={formatPrice(amount)} valueClass="text-error font-semibold" onCopy={() => copy(String(amount), 'số tiền')} />
            <InfoRow label="Nội dung CK" value={addInfo} onCopy={() => copy(addInfo, 'nội dung')} valueClass="text-primary font-semibold" />
            <p className="font-body text-xs text-secondary leading-relaxed mt-2 p-3 bg-surface-container-low border-l-2 border-primary/40">
              ⚠ Vui lòng nhập <strong>đúng nội dung CK</strong> để hệ thống xác nhận đơn hàng tự động.
            </p>
          </div>
        </div>

        {/* Footer — Trạng thái polling */}
        <div className="px-8 py-4 border-t border-outline-variant/20 flex items-center justify-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <p className="font-body text-xs text-secondary">
            Đang chờ xác nhận thanh toán... Hệ thống sẽ tự động cập nhật khi nhận được tiền.
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, onCopy, valueClass = '' }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-label text-[10px] uppercase tracking-[0.25em] text-secondary">{label}</span>
      <div className="flex items-center justify-between gap-3">
        <span className={`font-body text-base text-on-surface break-all ${valueClass}`}>{value}</span>
        {onCopy && (
          <button
            onClick={onCopy}
            type="button"
            className="text-outline hover:text-primary transition-colors flex-shrink-0"
            title="Sao chép"
          >
            <span className="material-symbols-outlined text-xl">content_copy</span>
          </button>
        )}
      </div>
    </div>
  );
}
