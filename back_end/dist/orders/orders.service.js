"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkout(userId, dto) {
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
            throw new common_1.BadRequestException('Giỏ hàng trống, không thể đặt hàng');
        }
        for (const item of cartItems) {
            if (item.variant.stockQuantity < item.quantity) {
                throw new common_1.BadRequestException(`Sản phẩm "${item.variant.sku}" (${item.variant.color.name} - ${item.variant.size}) chỉ còn ${item.variant.stockQuantity} sản phẩm trong kho`);
            }
        }
        const totalPrice = cartItems.reduce((sum, item) => {
            const price = Number(item.variant.color.product.discountPrice || item.variant.color.product.basePrice);
            return sum + price * item.quantity;
        }, 0);
        const order = await this.prisma.$transaction(async (tx) => {
            for (const item of cartItems) {
                const freshVariant = await tx.productVariant.findUnique({
                    where: { id: item.productVariantId },
                });
                if (!freshVariant || freshVariant.stockQuantity < item.quantity) {
                    throw new common_1.BadRequestException(`Sản phẩm "${item.variant.sku}" không đủ hàng trong kho`);
                }
            }
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    totalPrice,
                    status: 'pending',
                    paymentMethod: dto.paymentMethod || 'cod',
                    paymentStatus: 'unpaid',
                    shippingAddress: dto.shippingAddress,
                    phoneReceiver: dto.phoneReceiver,
                },
            });
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
                await tx.productVariant.update({
                    where: { id: item.productVariantId },
                    data: { stockQuantity: { decrement: item.quantity } },
                });
            }
            await tx.cartItem.deleteMany({ where: { userId } });
            return newOrder;
        });
        return {
            message: '🎉 Đặt hàng thành công!',
            order,
        };
    }
    async findAll(userId) {
        return this.prisma.order.findMany({
            where: userId ? { userId } : {},
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
    async findOne(id, userId, userRole) {
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
        if (!order)
            throw new common_1.NotFoundException('Đơn hàng không tồn tại');
        if (userRole && userRole !== 'admin' && order.userId !== userId) {
            throw new common_1.ForbiddenException('Bạn không có quyền xem đơn hàng này');
        }
        return order;
    }
    async updateStatus(id, dto) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Đơn hàng không tồn tại');
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
            data: { status: dto.status },
        });
    }
    async updatePaymentStatus(id, dto) {
        await this.findOne(id);
        return this.prisma.order.update({
            where: { id },
            data: { paymentStatus: dto.paymentStatus },
        });
    }
    async confirmBankingPayment(orderId) {
        const order = await this.findOne(orderId);
        if (order.paymentMethod !== 'banking') {
            throw new common_1.BadRequestException('Đơn hàng này không phải hình thức chuyển khoản');
        }
        if (order.paymentStatus === 'paid') {
            throw new common_1.BadRequestException('Đơn hàng đã được xác nhận thanh toán');
        }
        return this.prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: 'paid' },
        });
    }
    async handleCassoWebhook(payload) {
        const transactions = payload?.data;
        if (!Array.isArray(transactions) || transactions.length === 0) {
            return { message: 'Không có giao dịch nào' };
        }
        let matched = 0;
        for (const tx of transactions) {
            if (tx.transferType !== 'in')
                continue;
            const desc = (tx.description || '').toUpperCase().replace(/\s+/g, '');
            const match = desc.match(/THANHTOANDH(\d+)/);
            if (!match)
                continue;
            const orderId = parseInt(match[1], 10);
            if (isNaN(orderId))
                continue;
            const order = await this.prisma.order.findUnique({ where: { id: orderId } });
            if (!order)
                continue;
            if (order.paymentMethod !== 'banking')
                continue;
            if (order.paymentStatus === 'paid')
                continue;
            await this.prisma.order.update({
                where: { id: orderId },
                data: { paymentStatus: 'paid' },
            });
            matched++;
            console.log(`✅ Casso Webhook: Đơn hàng #${orderId} đã được xác nhận thanh toán (${tx.amount} VND)`);
        }
        return { message: `Đã xử lý ${matched} giao dịch` };
    }
    async getPaymentStatus(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            select: { id: true, paymentStatus: true, paymentMethod: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Đơn hàng không tồn tại');
        return order;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map