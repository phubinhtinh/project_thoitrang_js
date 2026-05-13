import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
        img: dto.img,
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

    // Chặn xóa biến thể cuối cùng — mỗi sản phẩm phải có ít nhất 1 biến thể
    const count = await this.prisma.productVariant.count({
      where: { productId: variant.productId },
    });
    if (count <= 1) {
      throw new BadRequestException(
        'Không thể xóa biến thể cuối cùng. Mỗi sản phẩm phải có ít nhất 1 biến thể.',
      );
    }

    return this.prisma.productVariant.delete({ where: { id } });
  }
}
