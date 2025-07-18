import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PushAllDto {
  @ApiProperty()
  @IsNotEmpty()
  testUsers: string[];

  @ApiProperty({ default: 'TEST' })
  @IsNotEmpty()
  mode: 'TEST' | 'NORMAL';
}
