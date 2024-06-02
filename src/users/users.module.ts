import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { GroupsModule } from '../groups/groups.module';
import { InstitutesModule } from '../institues/institutes.module';
import { StudentsController } from './controllers/students.controller';
import { SputniksController } from './controllers/sputniks.controller';
import { CuratorsController } from './controllers/curators.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), GroupsModule, InstitutesModule],
  controllers: [StudentsController, SputniksController, CuratorsController],
  providers: [UsersService],
})
export class UsersModule {}
