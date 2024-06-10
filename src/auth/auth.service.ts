import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { VkService } from '../vk/vk.service';
import { AuthDto } from './dtos/auth.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponseDto } from './dtos/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private vkService: VkService,
  ) {}

  async validateUser(authDto: AuthDto): Promise<AuthResponseDto> {
    const { vkId, vkToken } = authDto;

    const isValid = await this.vkService.verifyVkToken(vkId, vkToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid VK token');
    }

    const user = await this.usersService.findByVkId(vkId);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      uuid: user.uuid,
      vkId: user.vkId,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    return new AuthResponseDto(accessToken, user.role);
  }
}
