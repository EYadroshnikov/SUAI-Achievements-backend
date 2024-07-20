import { ApiProperty } from '@nestjs/swagger';
import { AchievementType } from '../enums/achievement-type.enum';
import { AchievementCategory } from '../enums/achievement-category.enum';
import { AchievementRarity } from '../enums/achievement-rarity.enum';

export class AchievementDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ enum: AchievementType })
  type: AchievementType;

  @ApiProperty({ enum: AchievementCategory })
  category: AchievementCategory;

  @ApiProperty({ enum: AchievementRarity })
  rarity: AchievementRarity;

  @ApiProperty({ required: false })
  reward?: number;

  @ApiProperty()
  hiddenIconPath: string;

  @ApiProperty({ required: false })
  openedIconPath?: string;

  @ApiProperty({ required: false })
  studentRequirement?: string;

  @ApiProperty({ required: false })
  hint?: string;

  @ApiProperty({ required: false })
  roflDescription?: string;
}
