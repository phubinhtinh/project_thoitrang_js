import { ColorsService } from './colors.service';
import { CreateColorDto, UpdateColorDto } from './dto/color.dto';
export declare class ColorsController {
    private colorsService;
    constructor(colorsService: ColorsService);
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
