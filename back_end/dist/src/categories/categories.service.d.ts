import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        children: ({
            children: {
                id: number;
                name: string;
                description: string | null;
                parentId: number | null;
                createdAt: Date;
            }[];
        } & {
            id: number;
            name: string;
            description: string | null;
            parentId: number | null;
            createdAt: Date;
        })[];
    } & {
        id: number;
        name: string;
        description: string | null;
        parentId: number | null;
        createdAt: Date;
    })[]>;
    findOne(id: number): Promise<{
        children: {
            id: number;
            name: string;
            description: string | null;
            parentId: number | null;
            createdAt: Date;
        }[];
        products: {
            id: number;
            name: string;
            description: string | null;
            createdAt: Date;
            basePrice: import("@prisma/client/runtime/library").Decimal;
            discountPrice: import("@prisma/client/runtime/library").Decimal | null;
            img: string | null;
            categoryId: number;
            updatedAt: Date;
        }[];
    } & {
        id: number;
        name: string;
        description: string | null;
        parentId: number | null;
        createdAt: Date;
    }>;
    create(dto: CreateCategoryDto): Promise<{
        id: number;
        name: string;
        description: string | null;
        parentId: number | null;
        createdAt: Date;
    }>;
    update(id: number, dto: UpdateCategoryDto): Promise<{
        id: number;
        name: string;
        description: string | null;
        parentId: number | null;
        createdAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        description: string | null;
        parentId: number | null;
        createdAt: Date;
    }>;
    getAllChildIds(parentId: number): Promise<number[]>;
}
