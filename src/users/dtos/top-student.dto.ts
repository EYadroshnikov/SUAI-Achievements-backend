import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class TopStudentDto {
  @ApiProperty({ required: false })
  @Expose()
  uuid: string;

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
}
