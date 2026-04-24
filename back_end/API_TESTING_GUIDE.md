# HƯỚNG DẪN TEST TOÀN BỘ 21 API CỦA SHOP THỜI TRANG BẰNG THUNDER CLIENT / POSTMAN

---
**💡 QUAN TRỌNG:**
- Base URL: `http://localhost:3000`
- Token: Mọi API nào có chữ `[CẦN TOKEN]` thì bạn phải qua thẻ **Headers**, thêm dòng `Authorization` với giá trị là `Bearer <Mã_Token_Lấy_Từ_Đăng_Nhập>`

---

## MỤC 1: XÁC THỰC (AUTH)

### 1. Đăng ký tài khoản
- Method: `POST` /auth/register
- Body (JSON):
```json
{
  "fullName": "Nguyen Van A",
  "email": "test@gmail.com",
  "password": "password123",
  "phone": "0901234567"
}
```

### 2. Đăng nhập (Copy token trả về)
- Method: `POST` /auth/login
- Body (JSON):
```json
{
  "email": "test@gmail.com",
  "password": "password123"
}
```

### 3. Lấy thông tin tài khoản [CẦN TOKEN]
- Method: `GET` /auth/profile

---

## MỤC 2: DANH MỤC (CATEGORIES)

### 4. Lấy tất cả danh mục (có đính kèm danh mục con)
- Method: `GET` /categories

### 5. Tạo danh mục cha mới
- Method: `POST` /categories
- Body (JSON):
```json
{
  "name": "Thời Trang Nam",
  "description": "Chuyên các loại quần áo nam"
}
```

### 6. Cập nhật danh mục (Sửa tên - ID: 1)
- Method: `PUT` /categories/1
- Body (JSON):
```json
{
  "name": "Áo Nam Mùa Đông"
}
```

### 7. Xóa danh mục (ID: 1)
- Method: `DELETE` /categories/1

---

## MỤC 3: SẢN PHẨM & BIẾN THỂ (PRODUCTS & VARIANTS)

### 8. Lấy toàn bộ Sản phẩm (có phân trang & lọc)
- Method: `GET` /products

### 9. Thêm mới 1 Sản phẩm (Thuộc danh mục ID=1)
- Method: `POST` /products
- Body (JSON):
```json
{
  "categoryId": 1,
  "name": "Áo Polo Yody Cao Cấp",
  "basePrice": 250000
}
```

### 10. Xem chi tiết Sản Phẩm (ID: 1)
- Method: `GET` /products/1

### 11. Sửa giảm giá Sản phẩm (ID: 1)
- Method: `PUT` /products/1
- Body (JSON):
```json
{
  "discountPrice": 180000
}
```

### 12. Thêm 1 Biến thể cho Sản Phẩm (ID SP: 1)
- Method: `POST` /products/1/variants
- Body (JSON):
```json
{
  "size": "L",
  "color": "Trắng",
  "stockQuantity": 100,
  "sku": "POLO-TRANG-L"
}
```

### 13. Xem các Biến thể của Sản phẩm 1
- Method: `GET` /products/1/variants

---

## MỤC 4: GIỎ HÀNG (CART) - TẤT CẢ [CẦN TOKEN]

### 14. Thêm hàng vào giỏ (Thêm Biến thể ID=1, SL=2)
- Method: `POST` /cart
- Body (JSON):
```json
{
  "productVariantId": 1,
  "quantity": 2
}
```

### 15. Tải Giỏ Hàng & Tính Tổng Tiền
- Method: `GET` /cart

### 16. Sửa số lượng trong giỏ (ID dòng giỏ hàng = 1, lên 5 cái)
- Method: `PUT` /cart/1
- Body (JSON):
```json
{
  "quantity": 5
}
```

### 17. Xóa món hàng khỏi giỏ (ID dòng giỏ = 1)
- Method: `DELETE` /cart/1

---

## MỤC 5: ĐẶT HÀNG (ORDERS) - TẤT CẢ [CẦN TOKEN]

### 18. Chốt Đơn Thanh Toán (Checkout)
- Method: `POST` /orders/checkout
- Body (JSON):
```json
{
  "paymentMethod": "cod",
  "shippingAddress": "123 Đường Số 1, Quận 10, TPHCM",
  "phoneReceiver": "0988111222"
}
```

### 19. Xem Danh sách Hóa Đơn của mình
- Method: `GET` /orders

### 20. Trạng thái giao hàng (Admin duyệt đơn ID: 1)
- Method: `PUT` /orders/1/status
- Body (JSON):
```json
{
  "status": "delivered"
}
```

---

## MỤC 6: ĐÁNH GIÁ (REVIEWS)

### 21. Viết Đánh Giá 5 Sao cho Sản Phẩm ID=1 [CẦN TOKEN]
*(Lưu ý: API này sẽ tự chặn mắng bạn nếu Đơn hàng chứa sp này chưa chuyển sang trạng thái "delivered" ở API số 20)*
- Method: `POST` /products/1/reviews
- Body (JSON):
```json
{
  "rating": 5,
  "comment": "Áo mặc siêu mát cưng xỉu"
}
```

### 22. Tải toàn bộ Review của Sản Phẩm 1
- Method: `GET` /products/1/reviews
