import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateStudentDto extends CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  instituteId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  groupId: number;
}
