import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'google-request-queue',
      limiter: {
        max: 1,
        duration: 1000,
      },
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
  ],
  providers: [GoogleService],
  exports: [GoogleService],
})
export class GoogleModule {}
