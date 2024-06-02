import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateStudentDto extends CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  instituteId: number;

  @ApiProperty()
  @IsNotEmpty()
  groupId: number;
}
