import { forwardRef, Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { InstitutesModule } from '../institues/institutes.module';
import { UsersModule } from '../users/users.module';
import { SpecialtiesModule } from '../specialties/specialties.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group]),
    InstitutesModule,
    SpecialtiesModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
