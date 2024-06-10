import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/enums/user-role.enum';

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  role: UserRole;

  constructor(accessToken: string, role: UserRole) {
    this.accessToken = accessToken;
    this.role = role;
  }
}
