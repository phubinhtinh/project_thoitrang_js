import { PrismaService } from '../prisma/prisma.service';
import { CreateVariantDto, UpdateVariantDto } from './dto/variant.dto';
export declare class VariantsService {
    private prisma;
    constructor(prisma: PrismaService);
    findByProduct(productId: number): Promise<{
        id: number;
        size: string;
        color: string;
        stockQuantity: number;
        sku: string;
        img: string | null;
        productId: number;
    }[]>;
    create(productId: number, dto: CreateVariantDto): Promise<{
        id: number;
        size: string;
        color: string;
        stockQuantity: number;
        sku: string;
        img: string | null;
        productId: number;
    }>;
    update(id: number, dto: UpdateVariantDto): Promise<{
        id: number;
        size: string;
        color: string;
        stockQuantity: number;
        sku: string;
        img: string | null;
        productId: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        size: string;
        color: string;
        stockQuantity: number;
        sku: string;
        img: string | null;
        productId: number;
    }>;
}
