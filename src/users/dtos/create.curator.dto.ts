import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCuratorDto extends CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  instituteId: number;
}
