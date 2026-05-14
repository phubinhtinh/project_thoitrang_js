import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Log đầy đủ để debug (chỉ hiện ở console server, không gửi cho client)
    if (!(exception instanceof HttpException)) {
      this.logger.error(
        `Unhandled exception on ${(request as any).method} ${(request as any).url}: ${exception?.message || exception}`,
        exception?.stack,
      );
      if (exception?.code) this.logger.error(`Prisma code: ${exception.code}`);
      if (exception?.meta) this.logger.error(`Prisma meta: ${JSON.stringify(exception.meta)}`);
    }

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Lỗi hệ thống, vui lòng thử lại sau';
    let error = 'Internal Server Error';

    // Dịch các lỗi Common
    if (exception instanceof HttpException) {
      const res = exception.getResponse() as any;
      error = res.error || 'Error';
      const defaultMessage = res.message;

      switch (status) {
        case HttpStatus.BAD_REQUEST:
          if (Array.isArray(defaultMessage)) {
             message = defaultMessage.join(', ');
          } else if (typeof defaultMessage === 'string') {
             message = defaultMessage;
          } else {
             message = 'Dữ liệu không hợp lệ hoặc thiếu thông tin';
          }
          break;
        case HttpStatus.UNAUTHORIZED:
          message = 'Vui lòng đăng nhập để thực hiện thao tác này';
          break;
        case HttpStatus.FORBIDDEN:
          message = 'Bạn không có quyền truy cập tính năng này';
          break;
        case HttpStatus.NOT_FOUND:
          message = 'Không tìm thấy tài nguyên yêu cầu (404)';
          break;
        case HttpStatus.CONFLICT:
          message = defaultMessage || 'Dữ liệu đã tồn tại trong hệ thống';
          break;
        default:
          message = typeof defaultMessage === 'string' ? defaultMessage : 'Đã có lỗi xảy ra';
      }
    } else {
      // Xử lý lỗi Prisma hoặc lỗi code không thuộc HttpException
      const exceptionString = exception?.toString() || '';
      const exceptionCode = exception?.code; // Mã lỗi Prisma

      if (exceptionString.includes('PrismaClientInitializationError') || exceptionString.includes('Can\'t reach database server')) {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message = 'Lỗi kết nối Cơ sở dữ liệu, vui lòng kiểm tra lại server DB';
        error = 'Database Connection Error';
      } else if (exceptionCode === 'P2003') {
        status = HttpStatus.BAD_REQUEST;
        message = 'Không thể xóa vì dữ liệu này đang được sử dụng (VD: Sản phẩm đã có trong Đơn hàng)';
        error = 'Foreign Key Constraint Failed';
      } else if (exceptionString.includes('PrismaClientKnownRequestError')) {
        message = 'Lỗi truy vấn dữ liệu (Prisma Error)';
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      error: error,
    });
  }
}
