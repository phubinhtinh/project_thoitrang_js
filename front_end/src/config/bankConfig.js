/**
 * Cấu hình tài khoản ngân hàng nhận thanh toán (DEMO).
 * Sau này có thể chuyển sang `.env` hoặc bảng `setting` trong DB.
 *
 * BANK_BIN: tra cứu tại https://api.vietqr.io/v2/banks
 *   - 970422 = MB Bank
 *   - 970436 = Vietcombank
 *   - 970418 = BIDV
 *   - 970432 = Techcombank
 *   - 970407 = Techcombank (cũ)
 */
export const BANK_CONFIG = {
  bankBin: '970422',
  bankName: 'MB Bank',
  accountNumber: '9704229212345678',
  accountName: 'SHOP THOITRANG ATELIER',
};

/**
 * Tạo URL ảnh QR VietQR (chuẩn EMV).
 * @param {object} opts
 * @param {number} opts.amount - Số tiền (VND)
 * @param {string} opts.addInfo - Nội dung chuyển khoản
 * @param {('compact'|'compact2'|'qr_only'|'print')} [opts.template]
 */
export function buildVietQRUrl({ amount, addInfo, template = 'compact2' }) {
  const params = new URLSearchParams({
    amount: String(amount),
    addInfo,
    accountName: BANK_CONFIG.accountName,
  });
  return `https://img.vietqr.io/image/${BANK_CONFIG.bankBin}-${BANK_CONFIG.accountNumber}-${template}.png?${params.toString()}`;
}
