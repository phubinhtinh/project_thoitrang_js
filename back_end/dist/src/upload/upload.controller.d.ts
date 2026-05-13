export declare class UploadController {
    uploadImage(file: Express.Multer.File, req: any): {
        url: string;
        filename: string;
        size: number;
        mimetype: string;
    };
}
