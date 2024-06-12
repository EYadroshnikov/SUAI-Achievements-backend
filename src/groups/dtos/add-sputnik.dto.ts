import { IsNumber, IsUUID } from 'class-validator';

export class AddSputnikDto {
  @IsUUID()
  sputnikUuid: string;

  @IsNumber()
  groupId: number;
}
