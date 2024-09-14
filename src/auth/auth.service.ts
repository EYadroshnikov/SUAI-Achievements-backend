import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { VkService } from '../vk/vk.service';
import { VkAuthDto } from './dtos/vk-auth.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { TgAuthDto } from './dtos/tg-auth.dto';
import { TelegramService } from '../telegram/telegram.service';
import { User } from '../users/entities/user.entity';
import { RefreshSessionsService } from './refresh-sessions.service';
import { FullAuthResponseDto } from './dtos/full-auth-response.dto';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly vkService: VkService,
    private readonly telegramService: TelegramService,
    private readonly refreshSessionsService: RefreshSessionsService,
  ) {}

  async validateUser(user: User, req: Request): Promise<FullAuthResponseDto> {
    if (user.isBanned) {
      throw new ForbiddenException('You have been banned');
    }

    const refreshSession =
      await this.refreshSessionsService.generateRefreshToken(req, user);

    const payload: JwtPayload = {
      uuid: user.uuid,
      vkId: user.vkId,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      role: user.role,
      refreshToken: refreshSession.refreshToken,
    };
  }

  async validateVkUser(
    vkAuthDto: VkAuthDto,
    req: Request,
  ): Promise<FullAuthResponseDto> {
    const { launchParams, sign } = vkAuthDto;

    const { isSignValid, vkUserID } = await this.vkService.verifyVkToken(
      launchParams,
      sign,
    );
    if (!isSignValid) {
      throw new UnauthorizedException('Invalid signature');
    }

    const user = await this.usersService.findByVkId(vkUserID);

    return this.validateUser(user, req);
  }

  async validateTgUser(
    tgAuthDto: TgAuthDto,
    req: Request,
  ): Promise<FullAuthResponseDto> {
    const { isSignValid, tgId } = await this.telegramService.verifyInitData(
      tgAuthDto.initData,
    );
    console.log(tgId);
    if (!isSignValid) {
      throw new UnauthorizedException('Invalid signature');
    }

    let user: User;
    try {
      user = await this.usersService.findByTgId(tgId);
    } catch (err) {
      const params = new URLSearchParams(tgAuthDto.initData);
      const vals: { [key: string]: string } = {};

      params.forEach((value, key) => {
        vals[key] = decodeURIComponent(value);
      });
      const tgUserObj = JSON.parse(vals['user']);
      console.log(tgUserObj.username);
      user = await this.usersService.findByTgUsername(tgUserObj.username);
      await this.usersService.updateUserTgId(user.uuid, tgId);
    }

    return this.validateUser(user, req);
  }

  async refresh(req: Request): Promise<FullAuthResponseDto> {
    console.log('REFRESH TOKEN: ' + req.cookies['refreshToken']);
    console.log(req.body['fingerprint']);
    console.log(req.headers['user-agent']);
    if (!req.cookies['refreshToken']) {
      throw new UnauthorizedException('No refresh token provided');
    }
    const refreshSession = await this.refreshSessionsService.findRefreshSession(
      req.cookies['refreshToken'],
    );
    console.log('FOUND SESSION');
    console.log(refreshSession);
    if (
      !refreshSession ||
      refreshSession.expiresAt.getTime() < Date.now() ||
      refreshSession.fingerprint != (req.body['fingerprint'] || '') ||
      refreshSession.userAgent != (req.headers['user-agent'] || '')
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.validateUser(refreshSession.user, req);
  }
}
