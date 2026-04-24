import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVariantDto, UpdateVariantDto } from './dto/variant.dto';

@Injectable()
export class VariantsService {
  constructor(private prisma: PrismaService) {}

  async findByProduct(productId: number) {
    return this.prisma.productVariant.findMany({
      where: { productId },
    });
  }

  async create(productId: number, dto: CreateVariantDto) {
    return this.prisma.productVariant.create({
      data: {
        productId,
        size: dto.size,
        color: dto.color,
        stockQuantity: dto.stockQuantity,
        sku: dto.sku,
      },
    });
  }

  async update(id: number, dto: UpdateVariantDto) {
    const variant = await this.prisma.productVariant.findUnique({ where: { id } });
    if (!variant) throw new NotFoundException('Biến thể không tồn tại');
    return this.prisma.productVariant.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    const variant = await this.prisma.productVariant.findUnique({ where: { id } });
    if (!variant) throw new NotFoundException('Biến thể không tồn tại');
    return this.prisma.productVariant.delete({ where: { id } });
  }
}
