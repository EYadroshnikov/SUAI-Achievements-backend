import { ApiProperty } from '@nestjs/swagger';
import { AchievementType } from '../enums/achievement-type.enum';
import { AchievementCategory } from '../enums/achievement-category.enum';
import { AchievementRarity } from '../enums/achievement-rarity.enum';

export class AchievementDto {
  @ApiProperty()
  uuid: string;

  // @ApiProperty()
  // isUnlocked: boolean;

  @ApiProperty()
  name?: string;

  @ApiProperty({ enum: AchievementType })
  type: AchievementType;

  @ApiProperty({ enum: AchievementCategory })
  category: AchievementCategory;

  @ApiProperty({ enum: AchievementRarity })
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
