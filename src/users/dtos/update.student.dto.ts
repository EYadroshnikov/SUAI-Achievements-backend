import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateStudentDto {
  @ApiProperty({ required: false })
  @IsString()
  firstName: string;

  @ApiProperty({ required: false })
  @IsString()
  lastName: string;

  @ApiProperty({ required: false })
  @IsString()
  patronymic: string;
}
