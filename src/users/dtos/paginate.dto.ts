import { PaginateQuery } from 'nestjs-paginate';
import { ApiProperty } from '@nestjs/swagger';

export class PaginateDto implements PaginateQuery {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  path: string;
}
