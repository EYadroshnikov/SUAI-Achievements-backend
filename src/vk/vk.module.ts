import { forwardRef, Module } from '@nestjs/common';
import { VkService } from './vk.service';
import { BullModule } from '@nestjs/bull';
import { VkRequestProcessor } from './vk-request.processor';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiniAppPushPermission } from './entities/mini-app-push-permission.entity';
import { VkController } from './vk.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([MiniAppPushPermission]),
    BullModule.registerQueue({
      name: 'vk-request-queue',
      limiter: {
        max: 3,
        duration: 1000,
      },
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
    forwardRef(() => UsersModule),
  ],
  controllers: [VkController],
  providers: [VkService, VkRequestProcessor],
  exports: [VkService],
})
export class VkModule {}
