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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(userId) {
        const items = await this.prisma.cartItem.findMany({
            where: { userId },
            include: {
                variant: {
                    include: {
                        color: {
                            include: {
                                product: {
                                    select: { id: true, name: true, basePrice: true, discountPrice: true },
                                },
                            },
                        },
                    },
                },
            },
        });
        const cartItems = items.map((item) => {
            const product = item.variant.color.product;
            const price = product.discountPrice || product.basePrice;
            return {
                ...item,
                itemTotal: Number(price) * item.quantity,
            };
        });
        const totalPrice = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);
        return { items: cartItems, totalPrice };
    }
    async addItem(userId, dto) {
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: dto.productVariantId },
        });
        if (!variant)
            throw new common_1.NotFoundException('Biến thể sản phẩm không tồn tại');
        if (variant.stockQuantity < (dto.quantity || 1)) {
            throw new common_1.BadRequestException('Số lượng tồn kho không đủ');
        }
        const existingItem = await this.prisma.cartItem.findFirst({
            where: { userId, productVariantId: dto.productVariantId },
        });
        if (existingItem) {
            const newQuantity = existingItem.quantity + (dto.quantity || 1);
            if (newQuantity > variant.stockQuantity) {
                throw new common_1.BadRequestException(`Tổng số lượng trong giỏ (${newQuantity}) vượt quá tồn kho (${variant.stockQuantity})`);
            }
            return this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity },
            });
        }
        return this.prisma.cartItem.create({
            data: {
                userId,
                productVariantId: dto.productVariantId,
                quantity: dto.quantity || 1,
            },
        });
    }
    async updateItem(id, userId, dto) {
        const item = await this.prisma.cartItem.findFirst({
            where: { id, userId },
            include: { variant: true },
        });
        if (!item)
            throw new common_1.NotFoundException('Không tìm thấy sản phẩm trong giỏ hàng');
        if (dto.quantity > item.variant.stockQuantity) {
            throw new common_1.BadRequestException(`Số lượng yêu cầu (${dto.quantity}) vượt quá tồn kho (${item.variant.stockQuantity})`);
        }
        if (dto.quantity <= 0) {
            throw new common_1.BadRequestException('Số lượng phải lớn hơn 0');
        }
        return this.prisma.cartItem.update({
            where: { id },
            data: { quantity: dto.quantity },
        });
    }
    async removeItem(id, userId) {
        const item = await this.prisma.cartItem.findFirst({
            where: { id, userId },
        });
        if (!item)
            throw new common_1.NotFoundException('Không tìm thấy sản phẩm trong giỏ hàng');
        return this.prisma.cartItem.delete({ where: { id } });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map