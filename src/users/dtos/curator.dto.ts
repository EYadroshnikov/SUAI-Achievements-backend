import { IsNotEmpty, IsNumber } from 'class-validator';
import { BaseUserDto } from './base-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CuratorDto extends BaseUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  instituteId: number;
}
