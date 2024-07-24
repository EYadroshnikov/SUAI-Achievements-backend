import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class AllRanksDto {
  @ApiProperty()
  @Expose()
  groupRank: number;

  @ApiProperty()
  @Expose()
  instituteRank: number;

  @ApiProperty()
  @Expose()
  universityRank: number;
}
