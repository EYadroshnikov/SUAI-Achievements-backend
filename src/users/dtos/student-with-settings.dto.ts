import { StudentDto } from './student.dto';
import { UserSettingsDto } from '../../user-settings/dtos/user-settings.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class StudentWithSettingsDto extends StudentDto {
  @ApiProperty()
  @Type(() => UserSettingsDto)
  @Expose()
  userSettings: UserSettingsDto;
}
