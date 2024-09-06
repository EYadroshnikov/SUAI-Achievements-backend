import { ApiProperty } from '@nestjs/swagger';

export class SpreadSheetLinkDto {
  @ApiProperty()
  spreadSheetLink: string;
}
