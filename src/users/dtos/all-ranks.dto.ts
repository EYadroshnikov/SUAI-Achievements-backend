import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RankDto } from './rank.dto';

@Exclude()
export class AllRanksDto {
  @ApiProperty({ type: RankDto })
  @Expose()
  @Type(() => RankDto)
  groupRank: RankDto;

  @ApiProperty({ type: RankDto })
  @Expose()
  @Type(() => RankDto)
  instituteRank: RankDto;

  @ApiProperty({ type: RankDto })
  @Expose()
  @Type(() => RankDto)
  universityRank: RankDto;
}
