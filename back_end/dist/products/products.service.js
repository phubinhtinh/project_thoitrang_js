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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const categories_service_1 = require("../categories/categories.service");
let ProductsService = class ProductsService {
    prisma;
    categoriesService;
    constructor(prisma, categoriesService) {
        this.prisma = prisma;
        this.categoriesService = categoriesService;
    }
    async findAll(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.search) {
            where.name = { contains: query.search };
        }
        if (query.category_id) {
            const catId = Number(query.category_id);
            const childIds = await this.categoriesService.getAllChildIds(catId);
            where.categoryId = { in: [catId, ...childIds] };
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                include: {
                    category: { select: { id: true, name: true } },
                    colors: { include: { variants: true }, orderBy: { id: 'asc' } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            data: products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: { select: { id: true, name: true } },
                colors: { include: { variants: true }, orderBy: { id: 'asc' } },
                reviews: {
                    include: {
                        user: { select: { id: true, fullName: true } },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!product)
            throw new common_1.NotFoundException('Sản phẩm không tồn tại');
        const avgRating = product.reviews.length
            ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
            : 0;
        return { ...product, avgRating: Math.round(avgRating * 10) / 10 };
    }
    async create(dto) {
        return this.prisma.product.create({
            data: {
                categoryId: dto.categoryId,
                name: dto.name,
                description: dto.description,
                basePrice: dto.basePrice,
                discountPrice: dto.discountPrice,
                colors: {
                    create: dto.colors.map((c) => ({
                        color: c.color,
                        img: c.img,
                        variants: {
                            create: c.variants.map((v) => ({
                                size: v.size,
                                stockQuantity: v.stockQuantity,
                                sku: v.sku,
                            })),
                        },
                    })),
                },
            },
            include: {
                category: { select: { id: true, name: true } },
                colors: { include: { variants: true }, orderBy: { id: 'asc' } },
            },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.product.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.product.delete({ where: { id } });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        categories_service_1.CategoriesService])
], ProductsService);
//# sourceMappingURL=products.service.js.map