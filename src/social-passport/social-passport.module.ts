import { Module } from '@nestjs/common';
import { SocialPassportService } from './social-passport.service';
import { SocialPassportController } from './social-passport.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialPassport } from './entities/social-passport.entity';
import { UsersModule } from '../users/users.module';
import { GoogleModule } from '../google/google.module';
import { InstitutesModule } from '../institues/institutes.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    // ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([SocialPassport]),
    UsersModule,
    InstitutesModule,
    GoogleModule,
  ],
  controllers: [SocialPassportController],
  providers: [SocialPassportService],
})
export class SocialPassportModule {}
