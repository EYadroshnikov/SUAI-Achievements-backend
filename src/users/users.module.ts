import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { GroupsModule } from '../groups/groups.module';
import { InstitutesModule } from '../institues/institutes.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), GroupsModule, InstitutesModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
