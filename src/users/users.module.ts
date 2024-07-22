import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { GroupsModule } from '../groups/groups.module';
import { InstitutesModule } from '../institues/institutes.module';
import { StudentsController } from './controllers/students.controller';
import { SputniksController } from './controllers/sputniks.controller';
import { CuratorsController } from './controllers/curators.controller';
import { VkModule } from '../vk/vk.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => GroupsModule),
    InstitutesModule,
    forwardRef(() => VkModule),
    TelegramModule,
  ],

  controllers: [StudentsController, SputniksController, CuratorsController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
