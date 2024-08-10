import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserSettings } from '../../user-settings/entities/user-settings.entity';

@Exclude()
export class TopStudentDto {
  @ApiProperty({ required: false })
  @Expose()
  firstName?: string;

  @ApiProperty({ required: false })
  @Expose()
  lastName?: string;

  @ApiProperty({ required: false })
  @Expose()
  avatar?: string;

  @ApiProperty()
  @Expose()
  balance: number;

  @ApiProperty({ type: UserSettings })
  @Type(() => UserSettings)
  @Expose()
  userSettings: UserSettings;
}
