import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateUserSettingsDto {
  @ApiProperty()
  @IsBoolean()
  isVisibleInTop: boolean;

  @ApiProperty()
  @IsBoolean()
  showUnseenAchievements: boolean;

  @ApiProperty()
  @IsBoolean()
  receiveTgAchievementNotifications: boolean;

  @ApiProperty()
  @IsBoolean()
  receiveVkAchievementNotifications: boolean;
}
