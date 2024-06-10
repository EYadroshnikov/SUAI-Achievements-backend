import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsNotEmpty()
  vkId: string;

  @ApiProperty()
  @IsNotEmpty()
  vkToken: string;
}
