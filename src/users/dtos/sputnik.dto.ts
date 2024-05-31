import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseUserDto } from './base-user.dto';

export class SputnikDto extends BaseUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  instituteId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  groupId: number;
}
