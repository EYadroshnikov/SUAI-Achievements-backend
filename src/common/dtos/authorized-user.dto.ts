import { UserRole } from '../../users/enums/user-role.enum';

export class AuthorizedUserDto {
  uuid: string;
  vkId: string;
  role: UserRole;
}
