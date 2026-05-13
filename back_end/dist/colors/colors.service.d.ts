import { PrismaService } from '../prisma/prisma.service';
import { CreateColorDto, UpdateColorDto } from './dto/color.dto';
export declare class ColorsService {
    private prisma;
    constructor(prisma: PrismaService);
    findByProduct(productId: number): Promise<({
        variants: {
            id: number;
            size: string;
            stockQuantity: number;
            sku: string;
            colorId: number;
        }[];
    } & {
        id: number;
        color: string;
        img: string;
        productId: number;
    })[]>;
    create(productId: number, dto: CreateColorDto): Promise<{
        variants: {
            id: number;
            size: string;
            stockQuantity: number;
            sku: string;
            colorId: number;
        }[];
    } & {
        id: number;
        color: string;
        img: string;
        productId: number;
    }>;
    update(id: number, dto: UpdateColorDto): Promise<{
        id: number;
        color: string;
        img: string;
        productId: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        color: string;
        img: string;
        productId: number;
    }>;
}
