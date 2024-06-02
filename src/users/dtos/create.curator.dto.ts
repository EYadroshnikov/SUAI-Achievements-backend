import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCuratorDto extends CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  instituteId: number;
}
