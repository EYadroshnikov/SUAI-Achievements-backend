import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ProofFileDto {
  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  mimetype: string;

  @ApiProperty()
  @Expose()
  size: number;

  @ApiProperty()
  @Expose()
  originalname: string;

  @ApiProperty()
  @Expose()
  fileName: string;
}
