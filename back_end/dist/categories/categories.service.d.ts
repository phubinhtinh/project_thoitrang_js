import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        children: ({
            children: {
                id: number;
                createdAt: Date;
                name: string;
                description: string | null;
                parentId: number | null;
            }[];
        } & {
            id: number;
            createdAt: Date;
            name: string;
            description: string | null;
            parentId: number | null;
        })[];
    } & {
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        parentId: number | null;
    })[]>;
    findOne(id: number): Promise<{
        children: {
            id: number;
            createdAt: Date;
            name: string;
            description: string | null;
            parentId: number | null;
        }[];
        products: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            categoryId: number;
            basePrice: import("@prisma/client/runtime/library").Decimal;
            discountPrice: import("@prisma/client/runtime/library").Decimal | null;
        }[];
    } & {
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        parentId: number | null;
    }>;
    create(dto: CreateCategoryDto): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        parentId: number | null;
    }>;
    update(id: number, dto: UpdateCategoryDto): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        parentId: number | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        parentId: number | null;
    }>;
    getAllChildIds(parentId: number): Promise<number[]>;
}
