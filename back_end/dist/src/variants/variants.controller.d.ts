import { VariantsService } from './variants.service';
import { CreateVariantDto, UpdateVariantDto } from './dto/variant.dto';
export declare class VariantsController {
    private variantsService;
    constructor(variantsService: VariantsService);
    findByProduct(productId: number): Promise<{
        id: number;
        img: string | null;
        sku: string;
        productId: number;
        size: string;
        color: string;
        stockQuantity: number;
    }[]>;
    create(productId: number, dto: CreateVariantDto): Promise<{
        id: number;
        img: string | null;
        sku: string;
        productId: number;
        size: string;
        color: string;
        stockQuantity: number;
    }>;
    update(id: number, dto: UpdateVariantDto): Promise<{
        id: number;
        img: string | null;
        sku: string;
        productId: number;
        size: string;
        color: string;
        stockQuantity: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        img: string | null;
        sku: string;
        productId: number;
        size: string;
        color: string;
        stockQuantity: number;
    }>;
}
