import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RankDto {
  @ApiProperty()
  @Expose()
  rank: number;
}
