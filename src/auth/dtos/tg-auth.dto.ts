import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TgAuthDto {
  @ApiProperty()
  @IsNotEmpty()
  initData: string;
}
