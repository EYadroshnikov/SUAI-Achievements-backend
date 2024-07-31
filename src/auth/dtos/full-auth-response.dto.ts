import { AuthResponseDto } from './auth-response.dto';

export class FullAuthResponseDto extends AuthResponseDto {
  refreshToken: string;
}
