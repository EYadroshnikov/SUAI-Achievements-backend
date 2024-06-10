import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthorizedUserDto } from '../users/dtos/authorized-user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('app.jwtSecret'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthorizedUserDto> {
    return { uuid: payload.uuid, vkId: payload.vkId, role: payload.role };
  }
}
