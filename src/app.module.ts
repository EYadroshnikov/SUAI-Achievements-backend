import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AchievementsModule } from './achievements/achievements.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import postgresConfig from './config/postres/postgres.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsModule } from './groups/groups.module';
import { InstitutesModule } from './institues/institutes.module';
import { VkModule } from './vk/vk.module';
import appConfig from './config/app/app.config';
import { LoggingMiddleware } from './common/middlewares/logging.middleware';
import { SpecialtiesModule } from './specialties/specialties.module';
import { TelegramModule } from './telegram/telegram.module';
import redisConfig from './config/redis/redis.config';
import { BullModule } from '@nestjs/bull';
import { SocialPassportModule } from './social-passport/social-passport.module';
import { GoogleModule } from './google/google.module';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { FilesModule } from './files/files.module';
import vkConfig from './config/vk/vk.config';
import telegramConfig from './config/telegram/telegram.config';
import googleConfig from './config/google/google.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [
        postgresConfig,
        appConfig,
        redisConfig,
        vkConfig,
        telegramConfig,
        googleConfig,
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('postgres.host'),
        port: configService.get('postgres.port'),
        username: configService.get('postgres.username'),
        password: configService.get('postgres.password'),
        database: configService.get('postgres.database'),
        autoLoadEntities: true,
        synchronize: false,
        connectTimeoutMS: 15000,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
        },
      }),
    }),

    AchievementsModule,
    UsersModule,
    AuthModule,
    GroupsModule,
    InstitutesModule,
    VkModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'achievement-icons'),
    //   serveRoot: '/achievement-icons',
    //   serveStaticOptions: {
    //     dotfiles: 'deny',
    //   },
    // }),
    SpecialtiesModule,
    TelegramModule,
    SocialPassportModule,
    GoogleModule,
    UserSettingsModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
