import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsNotEmpty()
  launchParams: string;

  @ApiProperty()
  @IsNotEmpty()
  sign: string;
}
