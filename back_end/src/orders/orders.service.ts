import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutDto, UpdateOrderStatusDto, UpdatePaymentStatusDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async checkout(userId: number, dto: CheckoutDto) {
    // Lấy giỏ hàng kèm thông tin variant và product
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        variant: {
          include: {
            color: {
              include: {
                product: { select: { basePrice: true, discountPrice: true } },
              },
            },
          },
        },
      },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Giỏ hàng trống, không thể đặt hàng');
    }

    // Kiểm tra kho hàng trước
    for (const item of cartItems) {
      if (item.variant.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Sản phẩm "${item.variant.sku}" (${item.variant.color.name} - ${item.variant.size}) chỉ còn ${item.variant.stockQuantity} sản phẩm trong kho`,
        );
      }
    }

    // Tính tổng tiền
    const totalPrice = cartItems.reduce((sum, item) => {
      const price = Number(item.variant.color.product.discountPrice || item.variant.color.product.basePrice);
      return sum + price * item.quantity;
    }, 0);

    // Transaction: Tạo đơn + Chi tiết + Trừ kho + Xóa giỏ
    const order = await this.prisma.$transaction(async (tx) => {
      // 0. Kiểm tra kho BÊN TRONG transaction để tránh race condition
      for (const item of cartItems) {
        const freshVariant = await tx.productVariant.findUnique({
          where: { id: item.productVariantId },
        });
        if (!freshVariant || freshVariant.stockQuantity < item.quantity) {
          throw new BadRequestException(
            `Sản phẩm "${item.variant.sku}" không đủ hàng trong kho`,
          );
        }
      }

      // 1. Tạo đơn hàng gốc
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalPrice,
          status: 'pending',
          paymentMethod: (dto.paymentMethod as any) || 'cod',
          paymentStatus: 'unpaid',
          shippingAddress: dto.shippingAddress,
          phoneReceiver: dto.phoneReceiver,
        },
      });

      // 2. Chép chi tiết đơn hàng (khóa giá tại thời điểm mua)
      for (const item of cartItems) {
        const price = Number(item.variant.color.product.discountPrice || item.variant.color.product.basePrice);
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            price,
          },
        });

        // 3. Trừ kho tự động
        await tx.productVariant.update({
          where: { id: item.productVariantId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      // 4. Dọn rác giỏ hàng
      await tx.cartItem.deleteMany({ where: { userId } });

      return newOrder;
    });

    return {
      message: '🎉 Đặt hàng thành công!',
      order,
    };
  }

  // User: chỉ xem đơn của mình | Admin: truyền null để xem tất cả
  async findAll(userId: number | null) {
    return this.prisma.order.findMany({
      where: userId ? { userId } : {},   // Admin không lọc theo userId
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        items: {
          include: {
            variant: {
              include: {
                color: {
                  include: {
                    product: { select: { id: true, name: true } },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId?: number, userRole?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        items: {
          include: {
            variant: {
              include: {
                color: {
                  include: {
                    product: { select: { id: true, name: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!order) throw new NotFoundException('Đơn hàng không tồn tại');

    if (userRole && userRole !== 'admin' && order.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem đơn hàng này');
    }

    return order;
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Đơn hàng không tồn tại');

    if (dto.status === 'cancelled' && order.status !== 'cancelled') {
      await this.prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          await tx.productVariant.update({
            where: { id: item.productVariantId },
            data: { stockQuantity: { increment: item.quantity } },
          });
        }
        await tx.order.update({
          where: { id },
          data: { status: 'cancelled' },
        });
      });
      return { message: 'Đã hủy đơn hàng và hoàn kho' };
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status as any },
    });
  }

  async updatePaymentStatus(id: number, dto: UpdatePaymentStatusDto) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: { paymentStatus: dto.paymentStatus as any },
    });
  }

  /**
   * User tự xác nhận đã chuyển khoản (chỉ dùng cho payment_method='banking').
   * Chỉ chủ đơn hàng mới được phép gọi. Demo mode: tự mark `paid`.
   */
  async confirmBankingPayment(orderId: number) {
    const order = await this.findOne(orderId);
    if (order.paymentMethod !== 'banking') {
      throw new BadRequestException('Đơn hàng này không phải hình thức chuyển khoản');
    }
    if (order.paymentStatus === 'paid') {
      throw new BadRequestException('Đơn hàng đã được xác nhận thanh toán');
    }
    return this.prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'paid' },
    });
  }

  /**
   * Xử lý webhook từ Casso khi có giao dịch mới.
   * Tìm nội dung CK dạng "THANHTOAN DH<id>" → cập nhật paymentStatus = 'paid'.
   */
  async handleCassoWebhook(payload: any) {
    const transactions = payload?.data;
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return { message: 'Không có giao dịch nào' };
    }

    let matched = 0;

    for (const tx of transactions) {
      // Chỉ xử lý giao dịch tiền VÀO
      if (tx.transferType !== 'in') continue;

      const desc = (tx.description || '').toUpperCase().replace(/\s+/g, '');
      // Tìm pattern THANHTOAN DH<số> hoặc THANHTOANDH<số>
      const match = desc.match(/THANHTOANDH(\d+)/);
      if (!match) continue;

      const orderId = parseInt(match[1], 10);
      if (isNaN(orderId)) continue;

      // Tìm đơn hàng
      const order = await this.prisma.order.findUnique({ where: { id: orderId } });
      if (!order) continue;
      if (order.paymentMethod !== 'banking') continue;
      if (order.paymentStatus === 'paid') continue;

      // Cập nhật trạng thái thanh toán
      await this.prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'paid' },
      });

      matched++;
      console.log(`✅ Casso Webhook: Đơn hàng #${orderId} đã được xác nhận thanh toán (${tx.amount} VND)`);
    }

    return { message: `Đã xử lý ${matched} giao dịch` };
  }

  /**
   * Trả về trạng thái thanh toán của đơn hàng (dùng cho frontend polling).
   */
  async getPaymentStatus(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, paymentStatus: true, paymentMethod: true },
    });
    if (!order) throw new NotFoundException('Đơn hàng không tồn tại');
    return order;
  }
}
