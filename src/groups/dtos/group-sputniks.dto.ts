import { GroupDto } from './group.dto';
import { Exclude, Expose } from 'class-transformer';
import { SputnikDto } from '../../users/dtos/sputnik.dto';

@Exclude()
export class GroupSputniksDto extends GroupDto {
  @Expose()
  sputniks: SputnikDto[];
}
