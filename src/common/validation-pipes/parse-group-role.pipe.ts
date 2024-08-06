import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { GroupRole } from '../../social-passport/enums/group-role.enum';

export class ParseGroupRolePipe implements PipeTransform<string, GroupRole> {
  transform(value: string, metadata: ArgumentMetadata): GroupRole {
    if (!(value in GroupRole)) {
      throw new BadRequestException(`Invalid group role: ${value}`);
    }
    return value as GroupRole;
  }
}
