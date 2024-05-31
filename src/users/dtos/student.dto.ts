import { BaseUserDto } from './base-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class StudentDto extends BaseUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  instituteId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  groupId: number;
}
