import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { Paginated } from 'nestjs-paginate';

interface ClassType<T> {
  new (): T;
}

@Injectable()
export class PaginatedTransformInterceptor<T>
  implements NestInterceptor<Partial<Paginated<T>>, Paginated<T>>
{
  constructor(private readonly classType: ClassType<T>) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data: Paginated<T>) => ({
        ...data,
        data: plainToInstance(this.classType, data.data),
      })),
    );
  }
}
