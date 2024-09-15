import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ReviewDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  response?: string;
}
