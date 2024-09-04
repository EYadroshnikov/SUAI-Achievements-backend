import { forwardRef, Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { BullModule } from '@nestjs/bull';
import { GoogleRequestProcessor } from './google-request.processor';
import { SocialPassportService } from '../social-passport/social-passport.service';
import { SocialPassportModule } from '../social-passport/social-passport.module';

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
    forwardRef(() => SocialPassportModule),
  ],
  providers: [GoogleService, GoogleRequestProcessor],
  exports: [GoogleService],
})
export class GoogleModule {}
