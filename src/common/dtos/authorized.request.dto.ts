import { AuthorizedUserDto } from './authorized-user.dto';

export class AuthorizedRequestDto extends Request {
  user: AuthorizedUserDto;
}
