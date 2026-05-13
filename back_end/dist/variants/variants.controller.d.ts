import { VariantsService } from './variants.service';
import { CreateVariantDto, UpdateVariantDto } from './dto/variant.dto';
export declare class VariantsController {
    private variantsService;
    constructor(variantsService: VariantsService);
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
