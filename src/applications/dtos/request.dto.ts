import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class RequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  achievementUuid: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  message?: string;
}
