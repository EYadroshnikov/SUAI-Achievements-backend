import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  CannotCreateEntityIdMapError,
  EntityNotFoundError,
  QueryFailedError,
} from 'typeorm';
import { GlobalResponseError } from './global.response.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let message = (exception as any).message;
    let code;

    if (
      !(exception instanceof NotFoundException) &&
      !(exception instanceof ConflictException)
    ) {
      Logger.error(
        message,
        (exception as any).stack,
        `${request.method} ${request.url}`,
      );
    }

    let status: HttpStatus;

    switch (exception.constructor) {
      case QueryFailedError:
        status = (exception as QueryFailedError).message.includes(
          'duplicate key value',
        )
          ? HttpStatus.CONFLICT
          : HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as QueryFailedError).message;
        code = (exception as any).code;
        break;
      case EntityNotFoundError:
        status = HttpStatus.NOT_FOUND;
        message = (exception as EntityNotFoundError).message;
        code = (exception as any).code;
        break;
      case CannotCreateEntityIdMapError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as CannotCreateEntityIdMapError).message;
        code = (exception as any).code;
        break;
      case HttpException:
        status = (exception as HttpException).getStatus();
        message = (exception as HttpException).getResponse();
        code = (exception as HttpException).getResponse()['error'];
        break;
      default:
        try {
          if ((exception as any).code === 'ENOENT') {
            status = HttpStatus.NOT_FOUND;
            message = 'ENOENT: no such file or directory';
            code = (exception as any).code;
            break;
          }
          status = (exception as HttpException).getStatus();
          message = (exception as HttpException).getResponse()['message'];
          code = (exception as HttpException).getResponse()['error'];
        } catch (e) {
          status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }

    response
      .status(status)
      .json(GlobalResponseError(status, message, code, request));
  }
}
