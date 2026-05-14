import { PrismaService } from '../prisma/prisma.service';
import { CreateVariantDto, UpdateVariantDto, CreateColorDto, UpdateColorDto } from './dto/variant.dto';
export declare class VariantsService {
    private prisma;
    constructor(prisma: PrismaService);
    findColorsByProduct(productId: number): Promise<({
        variants: {
            id: number;
            size: string;
            stockQuantity: number;
            sku: string;
            colorId: number;
        }[];
    } & {
        id: number;
        name: string;
        img: string | null;
        productId: number;
    })[]>;
    createColor(productId: number, dto: CreateColorDto): Promise<{
        variants: {
            id: number;
            size: string;
            stockQuantity: number;
            sku: string;
            colorId: number;
        }[];
    } & {
        id: number;
        name: string;
        img: string | null;
        productId: number;
    }>;
    updateColor(id: number, dto: UpdateColorDto): Promise<{
        variants: {
            id: number;
            size: string;
            stockQuantity: number;
            sku: string;
            colorId: number;
        }[];
    } & {
        id: number;
        name: string;
        img: string | null;
        productId: number;
    }>;
    removeColor(id: number): Promise<{
        id: number;
        name: string;
        img: string | null;
        productId: number;
    }>;
    createVariant(colorId: number, dto: CreateVariantDto): Promise<{
        id: number;
        size: string;
        stockQuantity: number;
        sku: string;
        colorId: number;
    }>;
    updateVariant(id: number, dto: UpdateVariantDto): Promise<{
        id: number;
        size: string;
        stockQuantity: number;
        sku: string;
        colorId: number;
    }>;
    removeVariant(id: number): Promise<{
        id: number;
        size: string;
        stockQuantity: number;
        sku: string;
        colorId: number;
    }>;
}
