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
    async findByProduct(productId) {
        return this.prisma.productVariant.findMany({
            where: { productId },
        });
    }
    async create(productId, dto) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new common_1.NotFoundException('Sản phẩm không tồn tại');
        return this.prisma.productVariant.create({
            data: {
                productId,
                size: dto.size,
                color: dto.color,
                stockQuantity: dto.stockQuantity,
                sku: dto.sku,
                img: dto.img,
            },
        });
    }
    async update(id, dto) {
        const variant = await this.prisma.productVariant.findUnique({ where: { id } });
        if (!variant)
            throw new common_1.NotFoundException('Biến thể không tồn tại');
        return this.prisma.productVariant.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id) {
        const variant = await this.prisma.productVariant.findUnique({ where: { id } });
        if (!variant)
            throw new common_1.NotFoundException('Biến thể không tồn tại');
        const count = await this.prisma.productVariant.count({
            where: { productId: variant.productId },
        });
        if (count <= 1) {
            throw new common_1.BadRequestException('Không thể xóa biến thể cuối cùng. Mỗi sản phẩm phải có ít nhất 1 biến thể.');
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