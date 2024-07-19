import { forwardRef, Module } from '@nestjs/common';
import { VkService } from './vk.service';
import { BullModule } from '@nestjs/bull';
import { VkAvatarProcessor } from './vk-avatar.processor';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'vk-avatar-queue',
      limiter: {
        max: 1,
        duration: 1000,
      },
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [VkService, VkAvatarProcessor],
  exports: [VkService],
})
export class VkModule {}
