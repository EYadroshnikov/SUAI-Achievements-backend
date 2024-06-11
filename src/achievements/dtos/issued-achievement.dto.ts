import { ApiProperty } from '@nestjs/swagger';
import { AchievementDto } from './achievement.dto';
import { UserDto } from '../../users/dtos/user.dto';
import { StudentDto } from '../../users/dtos/student.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class IssuedAchievementDto {
  @ApiProperty()
  @Expose()
  achievement: AchievementDto;

  @ApiProperty()
  @Expose()
  issuer: UserDto;

  @ApiProperty()
  @Expose()
  student: StudentDto;

  @ApiProperty()
  @Expose()
  reward: number;

  @ApiProperty()
  @Expose()
  isCanceled: number;
}
