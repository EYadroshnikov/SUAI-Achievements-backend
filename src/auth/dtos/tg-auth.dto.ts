import { IsNotEmpty } from 'class-validator';

export class TgAuthDto {
  @IsNotEmpty()
  initData: string;
}
