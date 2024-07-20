import { forwardRef, Module } from '@nestjs/common';
import { VkService } from './vk.service';
import { BullModule } from '@nestjs/bull';
import { VkRequestProcessor } from './vk-request.processor';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'vk-request-queue',
      limiter: {
        max: 1,
        duration: 500,
      },
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [VkService, VkRequestProcessor],
  exports: [VkService],
})
export class VkModule {}
