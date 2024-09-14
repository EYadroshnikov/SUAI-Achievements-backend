import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ReviewDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  response?: string;
}
