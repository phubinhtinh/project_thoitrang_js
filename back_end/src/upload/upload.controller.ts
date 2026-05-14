import 'dotenv/config';
import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

// Khởi tạo kết nối S3
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'ap-southeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

@Controller('upload')
export class UploadController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME || 'shopthoitrang-images-2026',
        acl: 'public-read', // Đảm bảo file được truy cập public (nếu bucket hỗ trợ)
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (_req, file, cb) => {
          const safeName = file.originalname
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .toLowerCase();
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const fileName = `${unique}-${safeName.slice(0, 40)}${extname(file.originalname).toLowerCase() || ''}`;
          cb(null, `images/${fileName}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!/^image\/(jpe?g|png|webp|gif|avif)$/i.test(file.mimetype)) {
          return cb(new BadRequestException('Chỉ chấp nhận ảnh JPG/PNG/WEBP/GIF/AVIF'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    }),
  )
  uploadImage(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('Không nhận được file');
    
    // multer-s3 sẽ gắn đường dẫn public của file trên S3 vào biến file.location
    return {
      url: file.location, 
      filename: file.key,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
