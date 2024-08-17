import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class UserSettingsDto {
  @ApiProperty({ description: 'If false, it is not shown in students rating' })
  @Expose()
  isVisibleInTop: boolean;

  @ApiProperty({
    description:
      "If false, achievements that have not been viewed won't be displayed.",
  })
  @Expose()
  showUnseenAchievements: boolean;

  @ApiProperty({
    description: 'If true, users receive notifications via Telegram.',
  })
  @Expose()
  receiveTgAchievementNotifications: boolean;

  @ApiProperty({ description: 'If true, users receive notifications via VK.' })
  @Expose()
  receiveVkAchievementNotifications: boolean;

  @ApiProperty({
    description: 'The date and time when the settings was last updated.',
  })
  @Expose()
  updatedAt: Date;
}
