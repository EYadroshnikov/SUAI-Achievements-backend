import { Module } from '@nestjs/common';
import { SocialPassportService } from './social-passport.service';
import { SocialPassportController } from './social-passport.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialPassport } from './entities/social-passport.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([SocialPassport]), UsersModule],
  controllers: [SocialPassportController],
  providers: [SocialPassportService],
})
export class SocialPassportModule {}
