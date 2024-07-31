import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { VkModule } from '../vk/vk.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { TelegramModule } from '../telegram/telegram.module';
import { RefreshSessionsService } from './refresh-sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshSession } from './entities/refresh-session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshSession]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('app.jwtSecret'),
        signOptions: {
          expiresIn: configService.get('app.accessTokenExpiration'),
        },
      }),
    }),
    UsersModule,
    VkModule,
    TelegramModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshSessionsService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
