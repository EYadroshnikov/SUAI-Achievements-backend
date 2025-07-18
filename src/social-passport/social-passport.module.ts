import { forwardRef, Module } from '@nestjs/common';
import { SocialPassportService } from './social-passport.service';
import { SocialPassportController } from './social-passport.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialPassport } from './entities/social-passport.entity';
import { UsersModule } from '../users/users.module';
import { GoogleModule } from '../google/google.module';
import { InstitutesModule } from '../institues/institutes.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SocialPassportExportConfigService } from './social-passport-export-config.service';
import { GroupsModule } from '../groups/groups.module';
import { TelegramModule } from '../telegram/telegram.module';
import { VkModule } from '../vk/vk.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([SocialPassport]),
    UsersModule,
    InstitutesModule,
    forwardRef(() => GoogleModule),
    GroupsModule,
    TelegramModule,
    VkModule,
  ],
  // controllers: [SocialPassportController],
  providers: [SocialPassportService, SocialPassportExportConfigService],
  exports: [SocialPassportService, SocialPassportExportConfigService],
})
export class SocialPassportModule {}
