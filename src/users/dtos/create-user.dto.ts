import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Capitalize } from '../../decorators/capitalize-first-letter.decorator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Capitalize()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Capitalize()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Capitalize()
  patronymic: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  vkId: string;
}
