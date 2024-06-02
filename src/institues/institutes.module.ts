import { Module } from '@nestjs/common';
import { InstitutesService } from './institutes.service';
import { InstitutesController } from './institutes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institute } from './entities/institute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Institute])],
  controllers: [InstitutesController],
  providers: [InstitutesService],
  exports: [InstitutesService],
})
export class InstitutesModule {}
