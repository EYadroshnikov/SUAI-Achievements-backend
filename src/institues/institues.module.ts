import { Module } from '@nestjs/common';
import { InstituesService } from './institues.service';
import { InstituesController } from './institues.controller';

@Module({
  controllers: [InstituesController],
  providers: [InstituesService],
})
export class InstituesModule {}
