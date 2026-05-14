import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Bảo mật HTTP Headers (chống XSS, clickjacking, MIME sniffing,...)
  // crossOriginResourcePolicy cần "cross-origin" để frontend (port 5173) load ảnh từ backend (port 3000)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // Phục vụ ảnh upload tại /uploads/<filename>
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  // Bật Validation toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Đăng ký Filter Việt hóa lỗi toàn cục
  app.useGlobalFilters(new HttpExceptionFilter());

  // Cho phép FrontEnd gọi API (CORS)
  // Hỗ trợ cả localhost (dev) và domain Render (production)
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: (origin, callback) => {
      // Cho phép requests không có origin (Postman, mobile, server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.onrender.com')
      ) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  await app.listen(3000);
  console.log('🚀 Server đang chạy tại http://localhost:3000');
}
bootstrap();
