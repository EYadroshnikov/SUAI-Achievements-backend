import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Transform } from 'class-transformer';

export class CreateSputnikDto extends CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  instituteId: number;

  @ApiProperty({ isArray: true, example: [0, 1] })
  @IsInt({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string' || typeof value === 'number') {
      return [+value];
    } else {
      return value.map(Number);
    }
  })
  groupIds: number[];
}
