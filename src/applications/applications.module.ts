import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { AchievementsModule } from '../achievements/achievements.module';
import { UsersModule } from '../users/users.module';
import { FileUploadService } from './file-upload.service';
import { ProofFile } from './entities/proof-file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, ProofFile]),
    AchievementsModule,
    UsersModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, FileUploadService],
})
export class ApplicationsModule {}
