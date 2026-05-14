import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVariantDto, UpdateVariantDto, CreateColorDto, UpdateColorDto } from './dto/variant.dto';

@Injectable()
export class VariantsService {
  constructor(private prisma: PrismaService) {}

  // ===== COLOR =====

  async findColorsByProduct(productId: number) {
    return this.prisma.productColor.findMany({
      where: { productId },
      include: { variants: true },
      orderBy: { id: 'asc' },
    });
  }

  async createColor(productId: number, dto: CreateColorDto) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

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

  async updateColor(id: number, dto: UpdateColorDto) {
    const color = await this.prisma.productColor.findUnique({ where: { id } });
    if (!color) throw new NotFoundException('Màu không tồn tại');
    return this.prisma.productColor.update({
      where: { id },
      data: { name: dto.name, img: dto.img },
      include: { variants: true },
    });
  }

  async removeColor(id: number) {
    const color = await this.prisma.productColor.findUnique({ where: { id } });
    if (!color) throw new NotFoundException('Màu không tồn tại');

    // Chặn xóa màu cuối cùng
    const count = await this.prisma.productColor.count({
      where: { productId: color.productId },
    });
    if (count <= 1) {
      throw new BadRequestException('Không thể xóa màu cuối cùng. Mỗi sản phẩm phải có ít nhất 1 màu.');
    }

    return this.prisma.productColor.delete({ where: { id } });
  }

  // ===== VARIANT (SIZE) =====

  async createVariant(colorId: number, dto: CreateVariantDto) {
    const color = await this.prisma.productColor.findUnique({ where: { id: colorId } });
    if (!color) throw new NotFoundException('Màu không tồn tại');

    return this.prisma.productVariant.create({
      data: {
        colorId,
        size: dto.size,
        stockQuantity: dto.stockQuantity,
        sku: dto.sku,
      },
    });
  }

  async updateVariant(id: number, dto: UpdateVariantDto) {
    const variant = await this.prisma.productVariant.findUnique({ where: { id } });
    if (!variant) throw new NotFoundException('Biến thể không tồn tại');
    return this.prisma.productVariant.update({
      where: { id },
      data: dto,
    });
  }

  async removeVariant(id: number) {
    const variant = await this.prisma.productVariant.findUnique({ where: { id } });
    if (!variant) throw new NotFoundException('Biến thể không tồn tại');

    // Chặn xóa size cuối cùng của một màu
    const count = await this.prisma.productVariant.count({
      where: { colorId: variant.colorId },
    });
    if (count <= 1) {
      throw new BadRequestException('Không thể xóa size cuối cùng. Mỗi màu phải có ít nhất 1 size.');
    }

    return this.prisma.productVariant.delete({ where: { id } });
  }
}
