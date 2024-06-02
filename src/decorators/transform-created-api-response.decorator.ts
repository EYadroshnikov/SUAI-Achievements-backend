import { UseInterceptors } from '@nestjs/common';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { ApiCreatedResponse } from '@nestjs/swagger';

export function TransformCreatedApiResponse(type: any) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    UseInterceptors(new TransformInterceptor(type))(
      target,
      propertyKey,
      descriptor,
    );
    ApiCreatedResponse({ type: type })(target, propertyKey, descriptor);
  };
}
