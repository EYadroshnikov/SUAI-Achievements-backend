import { ApiProperty } from '@nestjs/swagger';
import { AchievementType } from '../enums/achievement-type.enum';
import { AchievementCategory } from '../enums/achievement-category.enum';
import { AchievementRarity } from '../enums/achievement-rarity.enum';

export class AchievementDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  name?: string;

  @ApiProperty({ type: AchievementType })
  type: AchievementType;

  @ApiProperty({ type: AchievementCategory })
  category: AchievementCategory;

  @ApiProperty({ type: AchievementRarity })
  rarity: AchievementRarity;

  @ApiProperty()
  reward?: number;

  @ApiProperty()
  hiddenIconPath: string;

  @ApiProperty()
  openedIconPath?: string;

  @ApiProperty()
  studentRequirement: string;

  @ApiProperty()
  hint?: string;

  @ApiProperty()
  roflDescription?: string;
}
