import { Module } from '@nestjs/common';
import { InstituesService } from './institues.service';
import { InstituesController } from './institues.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institute } from './entities/institute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Institute])],
  controllers: [InstituesController],
  providers: [InstituesService],
})
export class InstituesModule {}
