import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateColorDto, UpdateColorDto } from './dto/color.dto';

@Injectable()
export class ColorsService {
  constructor(private prisma: PrismaService) {}

  async findByProduct(productId: number) {
    return this.prisma.productColor.findMany({
      where: { productId },
      include: { variants: { orderBy: { id: 'asc' } } },
      orderBy: { id: 'asc' },
    });
  }

  async create(productId: number, dto: CreateColorDto) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

    return this.prisma.productColor.create({
      data: {
        productId,
        color: dto.color,
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

  async update(id: number, dto: UpdateColorDto) {
    const color = await this.prisma.productColor.findUnique({ where: { id } });
    if (!color) throw new NotFoundException('Màu không tồn tại');
    return this.prisma.productColor.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const color = await this.prisma.productColor.findUnique({ where: { id } });
    if (!color) throw new NotFoundException('Màu không tồn tại');

    // Chặn xóa màu cuối cùng — sản phẩm phải có ít nhất 1 màu
    const count = await this.prisma.productColor.count({
      where: { productId: color.productId },
    });
    if (count <= 1) {
      throw new BadRequestException(
        'Không thể xóa màu cuối cùng. Mỗi sản phẩm phải có ít nhất 1 màu.',
      );
    }

    return this.prisma.productColor.delete({ where: { id } });
  }
}
