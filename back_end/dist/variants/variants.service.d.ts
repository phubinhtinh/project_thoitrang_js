import { PrismaService } from '../prisma/prisma.service';
import { CreateVariantDto, UpdateVariantDto } from './dto/variant.dto';
export declare class VariantsService {
    private prisma;
    constructor(prisma: PrismaService);
    findByColor(colorId: number): Promise<{
        id: number;
        size: string;
        stockQuantity: number;
        sku: string;
        colorId: number;
    }[]>;
    create(colorId: number, dto: CreateVariantDto): Promise<{
        id: number;
        size: string;
        stockQuantity: number;
        sku: string;
        colorId: number;
    }>;
    update(id: number, dto: UpdateVariantDto): Promise<{
        id: number;
        size: string;
        stockQuantity: number;
        sku: string;
        colorId: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        size: string;
        stockQuantity: number;
        sku: string;
        colorId: number;
    }>;
}
