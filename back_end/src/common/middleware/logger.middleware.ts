import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    // Lắng nghe sự kiện response hoàn thành
    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;

      // Chọn màu log theo status code
      const logMessage = `${method} ${originalUrl} - ${statusCode} - ${duration}ms - ${ip} - ${userAgent}`;

      if (statusCode >= 500) {
        this.logger.error(logMessage);   // Đỏ — Lỗi server
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage);    // Vàng — Lỗi client
      } else {
        this.logger.log(logMessage);     // Xanh — Thành công
      }
    });

    next();
  }
}
