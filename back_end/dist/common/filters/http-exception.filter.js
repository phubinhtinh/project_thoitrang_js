"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    logger = new common_1.Logger('HttpExceptionFilter');
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        if (!(exception instanceof common_1.HttpException)) {
            this.logger.error(`Unhandled exception on ${request.method} ${request.url}: ${exception?.message || exception}`, exception?.stack);
            if (exception?.code)
                this.logger.error(`Prisma code: ${exception.code}`);
            if (exception?.meta)
                this.logger.error(`Prisma meta: ${JSON.stringify(exception.meta)}`);
        }
        let status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Lỗi hệ thống, vui lòng thử lại sau';
        let error = 'Internal Server Error';
        if (exception instanceof common_1.HttpException) {
            const res = exception.getResponse();
            error = res.error || 'Error';
            const defaultMessage = res.message;
            switch (status) {
                case common_1.HttpStatus.BAD_REQUEST:
                    if (Array.isArray(defaultMessage)) {
                        message = defaultMessage.join(', ');
                    }
                    else if (typeof defaultMessage === 'string') {
                        message = defaultMessage;
                    }
                    else {
                        message = 'Dữ liệu không hợp lệ hoặc thiếu thông tin';
                    }
                    break;
                case common_1.HttpStatus.UNAUTHORIZED:
                    message = 'Vui lòng đăng nhập để thực hiện thao tác này';
                    break;
                case common_1.HttpStatus.FORBIDDEN:
                    message = 'Bạn không có quyền truy cập tính năng này';
                    break;
                case common_1.HttpStatus.NOT_FOUND:
                    message = 'Không tìm thấy tài nguyên yêu cầu (404)';
                    break;
                case common_1.HttpStatus.CONFLICT:
                    message = defaultMessage || 'Dữ liệu đã tồn tại trong hệ thống';
                    break;
                default:
                    message = typeof defaultMessage === 'string' ? defaultMessage : 'Đã có lỗi xảy ra';
            }
        }
        else {
            const exceptionString = exception?.toString() || '';
            if (exceptionString.includes('PrismaClientInitializationError') || exceptionString.includes('Can\'t reach database server')) {
                status = common_1.HttpStatus.SERVICE_UNAVAILABLE;
                message = 'Lỗi kết nối Cơ sở dữ liệu, vui lòng kiểm tra lại server DB';
                error = 'Database Connection Error';
            }
            else if (exceptionString.includes('PrismaClientKnownRequestError')) {
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
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map