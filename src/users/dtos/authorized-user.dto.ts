import { UserRole } from '../enums/user-role.enum';

export class AuthorizedUserDto {
  uuid: string;
  vkId: string;
  role: UserRole;
}
