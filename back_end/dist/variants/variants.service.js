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
exports.VariantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VariantsService = class VariantsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findColorsByProduct(productId) {
        return this.prisma.productColor.findMany({
            where: { productId },
            include: { variants: true },
            orderBy: { id: 'asc' },
        });
    }
    async createColor(productId, dto) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new common_1.NotFoundException('Sản phẩm không tồn tại');
        return this.prisma.productColor.create({
            data: {
                productId,
                name: dto.name,
                img: dto.img,
                variants: {
                    create: dto.variants.map((v) => ({
                        size: v.size,
                        stockQuantity: v.stockQuantity,
                        sku: v.sku,
                    })),
                },
            },
            include: { variants: true },
        });
    }
    async updateColor(id, dto) {
        const color = await this.prisma.productColor.findUnique({ where: { id } });
        if (!color)
            throw new common_1.NotFoundException('Màu không tồn tại');
        return this.prisma.productColor.update({
            where: { id },
            data: { name: dto.name, img: dto.img },
            include: { variants: true },
        });
    }
    async removeColor(id) {
        const color = await this.prisma.productColor.findUnique({ where: { id } });
        if (!color)
            throw new common_1.NotFoundException('Màu không tồn tại');
        const count = await this.prisma.productColor.count({
            where: { productId: color.productId },
        });
        if (count <= 1) {
            throw new common_1.BadRequestException('Không thể xóa màu cuối cùng. Mỗi sản phẩm phải có ít nhất 1 màu.');
        }
        return this.prisma.productColor.delete({ where: { id } });
    }
    async createVariant(colorId, dto) {
        const color = await this.prisma.productColor.findUnique({ where: { id: colorId } });
        if (!color)
            throw new common_1.NotFoundException('Màu không tồn tại');
        return this.prisma.productVariant.create({
            data: {
                colorId,
                size: dto.size,
                stockQuantity: dto.stockQuantity,
                sku: dto.sku,
            },
        });
    }
    async updateVariant(id, dto) {
        const variant = await this.prisma.productVariant.findUnique({ where: { id } });
        if (!variant)
            throw new common_1.NotFoundException('Biến thể không tồn tại');
        return this.prisma.productVariant.update({
            where: { id },
            data: dto,
        });
    }
    async removeVariant(id) {
        const variant = await this.prisma.productVariant.findUnique({ where: { id } });
        if (!variant)
            throw new common_1.NotFoundException('Biến thể không tồn tại');
        const count = await this.prisma.productVariant.count({
            where: { colorId: variant.colorId },
        });
        if (count <= 1) {
            throw new common_1.BadRequestException('Không thể xóa size cuối cùng. Mỗi màu phải có ít nhất 1 size.');
        }
        return this.prisma.productVariant.delete({ where: { id } });
    }
};
exports.VariantsService = VariantsService;
exports.VariantsService = VariantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VariantsService);
//# sourceMappingURL=variants.service.js.map