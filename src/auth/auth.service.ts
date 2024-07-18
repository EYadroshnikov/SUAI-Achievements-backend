import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { VkService } from '../vk/vk.service';
import { AuthDto } from './dtos/auth.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { TgAuthDto } from './dtos/tg-auth.dto';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private vkService: VkService,
    private telegramService: TelegramService,
  ) {}

  async validateUser(authDto: AuthDto): Promise<AuthResponseDto> {
    const { launchParams, sign } = authDto;

    const { isSignValid, vkUserID } = await this.vkService.verifyVkToken(
      launchParams,
      sign,
    );
    if (!isSignValid) {
      throw new UnauthorizedException('Invalid sing');
    }

    const user = await this.usersService.findByVkId(vkUserID);

    const payload: JwtPayload = {
      uuid: user.uuid,
      vkId: user.vkId,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, role: user.role };
  }

  async validateTgUser(tgAuthDto: TgAuthDto) {
    const { isSignValid, tgId } = await this.telegramService.verifyInitData(
      tgAuthDto.initData,
    );
    if (!isSignValid) {
      throw new UnauthorizedException('Invalid sing');
    }

    let user = await this.usersService.findByTgId(tgId);
    if (!user) {
      const params = new URLSearchParams(tgAuthDto.initData);
      const vals: { [key: string]: string } = {};

      params.forEach((value, key) => {
        vals[key] = decodeURIComponent(value);
      });
      const tgUserObj = JSON.parse(vals['user']);

      user = await this.usersService.findByTgUsername(tgUserObj.username);
      await this.usersService.updateUserTgId(user.uuid, tgId);
    }

    const payload: JwtPayload = {
      uuid: user.uuid,
      vkId: user.vkId,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, role: user.role };
  }
}
