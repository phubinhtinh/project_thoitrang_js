import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVariantDto, UpdateVariantDto } from './dto/variant.dto';

@Injectable()
export class VariantsService {
  constructor(private prisma: PrismaService) {}

  async findByColor(colorId: number) {
    return this.prisma.productVariant.findMany({
      where: { colorId },
      orderBy: { id: 'asc' },
    });
  }

  async create(colorId: number, dto: CreateVariantDto) {
    const color = await this.prisma.productColor.findUnique({ where: { id: colorId } });
    if (!color) throw new NotFoundException('Màu sản phẩm không tồn tại');
    return this.prisma.productVariant.create({
      data: {
        colorId,
        size: dto.size,
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
    const variant = await this.prisma.productVariant.findUnique({
      where: { id },
      include: { productColor: true },
    });
    if (!variant) throw new NotFoundException('Biến thể không tồn tại');

    // Chặn xóa size cuối cùng của 1 màu — mỗi màu phải có ít nhất 1 size
    const count = await this.prisma.productVariant.count({
      where: { colorId: variant.colorId },
    });
    if (count <= 1) {
      throw new BadRequestException(
        'Không thể xóa size cuối cùng của màu này. Hãy xóa cả màu nếu không cần.',
      );
    }

    return this.prisma.productVariant.delete({ where: { id } });
  }
}
