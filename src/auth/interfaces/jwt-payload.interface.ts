import { UserRole } from '../../users/enums/user-role.enum';

export interface JwtPayload {
  uuid: string;
  vkId: string;
  role: UserRole;
}
