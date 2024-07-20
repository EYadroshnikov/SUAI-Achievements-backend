import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';

@Exclude()
export class UserDto {
  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty({ required: false })
  @Expose()
  patronymic?: string;

  @ApiProperty()
  @Expose()
  vkId: string;

  @ApiProperty()
  @Expose()
  role: UserRole;

  @ApiProperty()
  @Expose()
  isBanned: boolean;

  @ApiProperty({ required: false })
  @Expose()
  avatar?: string;
}
