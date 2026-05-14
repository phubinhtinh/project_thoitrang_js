import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

// Include mặc định: Product → Colors → Variants
const PRODUCT_INCLUDE = {
  category: { select: { id: true, name: true } },
  colors: {
    include: { variants: true },
    orderBy: { id: 'asc' as const },
  },
  reviews: false as const,
};

const PRODUCT_DETAIL_INCLUDE = {
  category: { select: { id: true, name: true } },
  colors: {
    include: { variants: true },
    orderBy: { id: 'asc' as const },
  },
  reviews: {
    include: {
      user: { select: { id: true, fullName: true } },
    },
    orderBy: { createdAt: 'desc' as const },
  },
};

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private categoriesService: CategoriesService,
  ) {}

  async findAll(query: { search?: string; category_id?: string; page?: string; limit?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

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
        include: PRODUCT_INCLUDE,
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

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: PRODUCT_DETAIL_INCLUDE,
    });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

    const avgRating = product.reviews.length
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

    return { ...product, avgRating: Math.round(avgRating * 10) / 10 };
  }

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        categoryId: dto.categoryId,
        name: dto.name,
        description: dto.description,
        basePrice: dto.basePrice,
        discountPrice: dto.discountPrice,
        colors: {
          create: dto.colors.map((color) => ({
            name: color.name,
            img: color.img,
            variants: {
              create: color.variants.map((v) => ({
                size: v.size,
                stockQuantity: v.stockQuantity,
                sku: v.sku,
              })),
            },
          })),
        },
      },
      include: PRODUCT_INCLUDE,
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: {
        categoryId: dto.categoryId,
        name: dto.name,
        description: dto.description,
        basePrice: dto.basePrice,
        discountPrice: dto.discountPrice,
      },
      include: PRODUCT_INCLUDE,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
