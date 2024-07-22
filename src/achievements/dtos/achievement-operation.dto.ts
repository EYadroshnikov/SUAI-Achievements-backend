import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { AchievementOperationType } from '../enums/achievement-operation-type.enum';
import { AchievementDto } from './achievement.dto';
import { UserDto } from '../../users/dtos/user.dto';
import { StudentDto } from '../../users/dtos/student.dto';

@Exclude()
export class AchievementOperationDto {
  @ApiProperty({ enum: AchievementOperationType })
  @Expose()
  type: AchievementOperationType;

  @ApiProperty({ type: AchievementDto })
  @Type(() => AchievementDto)
  @Expose()
  achievement: AchievementDto;

  @ApiProperty({ type: UserDto })
  @Type(() => UserDto)
  @Expose()
  executor: UserDto;

  @ApiProperty({ type: StudentDto })
  @Type(() => StudentDto)
  @Expose()
  student: StudentDto;

  @ApiProperty({ required: false })
  @Expose()
  cancellationReason?: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}
