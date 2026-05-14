"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
require("dotenv/config");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_s3_1 = __importDefault(require("multer-s3"));
const path_1 = require("path");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || 'ap-southeast-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});
let UploadController = class UploadController {
    uploadImage(file) {
        if (!file)
            throw new common_1.BadRequestException('Không nhận được file');
        return {
            url: file.location,
            filename: file.key,
            size: file.size,
            mimetype: file.mimetype,
        };
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.admin),
    (0, common_1.Post)('image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_s3_1.default)({
            s3: s3,
            bucket: process.env.AWS_S3_BUCKET_NAME || 'shopthoitrang-images-2026',
            contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
            key: (_req, file, cb) => {
                const safeName = file.originalname
                    .replace(/[^a-zA-Z0-9.-]/g, '_')
                    .toLowerCase();
                const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                const fileName = `${unique}-${safeName.slice(0, 40)}${(0, path_1.extname)(file.originalname).toLowerCase() || ''}`;
                cb(null, `images/${fileName}`);
            },
        }),
        fileFilter: (_req, file, cb) => {
            if (!/^image\/(jpe?g|png|webp|gif|avif)$/i.test(file.mimetype)) {
                return cb(new common_1.BadRequestException('Chỉ chấp nhận ảnh JPG/PNG/WEBP/GIF/AVIF'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 20 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadImage", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.Controller)('upload')
], UploadController);
//# sourceMappingURL=upload.controller.js.map