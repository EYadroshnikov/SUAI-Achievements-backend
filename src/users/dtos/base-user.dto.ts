import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class BaseUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  patronymic: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  vkId: string;
}
