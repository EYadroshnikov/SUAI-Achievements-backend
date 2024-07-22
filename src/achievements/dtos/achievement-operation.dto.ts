import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AchievementOperationType } from '../enums/achievement-operation-type.enum';
import { AchievementDto } from './achievement.dto';
import { UserDto } from '../../users/dtos/user.dto';
import { StudentDto } from '../../users/dtos/student.dto';

@Expose()
export class AchievementOperationDto {
  @ApiProperty({ type: AchievementOperationType })
  @Expose()
  type: AchievementOperationType;

  @ApiProperty({ type: AchievementDto })
  @Expose()
  achievement: AchievementDto;

  @ApiProperty({ type: UserDto })
  @Expose()
  executor: UserDto;

  @ApiProperty({ type: StudentDto })
  @Expose()
  student: StudentDto;

  @ApiProperty({ required: false })
  @Expose()
  cancellationReason?: string;

  @ApiProperty()
  @Expose()
  createAt: Date;
}
