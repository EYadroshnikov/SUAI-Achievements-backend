import { Injectable, NestMiddleware, Logger, HttpStatus } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, baseUrl: baseUrl } = request;
    const ip = request.get('X-Real-IP');
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode, statusMessage } = response;
      const contentLength = response.get('content-length');
      const message = `${method} ${baseUrl} [${statusCode}] ${statusMessage} ${contentLength} - ${userAgent} ${ip}`;

      if (
        statusCode === HttpStatus.FORBIDDEN ||
        statusCode === HttpStatus.BAD_REQUEST
      ) {
        this.logger.error(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}
