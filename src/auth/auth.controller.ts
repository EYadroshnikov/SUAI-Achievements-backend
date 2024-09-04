import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VkAuthDto } from './dtos/vk-auth.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { TgAuthDto } from './dtos/tg-auth.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { RefreshSessionsService } from './refresh-sessions.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly refreshSessionsService: RefreshSessionsService,
  ) {}

  @Post('/vk/login')
  @ApiOkResponse({ type: AuthResponseDto })
  async vkLogin(
    @Body() vkAuthDto: VkAuthDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const fullAuthResponseDto = await this.authService.validateVkUser(
      vkAuthDto,
      req,
    );

    res.cookie(
      'refreshToken',
      fullAuthResponseDto.refreshToken,
      this.refreshSessionsService.COOKIE_OPTIONS,
    );
    res.send({
      accessToken: fullAuthResponseDto.accessToken,
      role: fullAuthResponseDto.role,
    });
  }

  @Post('/tg/login')
  @ApiOkResponse({ type: AuthResponseDto })
  async tgLogin(
    @Body() tgAuthDto: TgAuthDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const fullAuthResponseDto = await this.authService.validateTgUser(
      tgAuthDto,
      req,
    );

    res.cookie(
      'refreshToken',
      fullAuthResponseDto.refreshToken,
      this.refreshSessionsService.COOKIE_OPTIONS,
    );
    res.send({
      accessToken: fullAuthResponseDto.accessToken,
      role: fullAuthResponseDto.role,
    });
  }

  @Post('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const fullAuthResponseDto = await this.authService.refresh(req);
    console.log(fullAuthResponseDto);
    res.cookie(
      'refreshToken',
      fullAuthResponseDto.refreshToken,
      this.refreshSessionsService.COOKIE_OPTIONS,
    );
    res.send({
      accessToken: fullAuthResponseDto.accessToken,
      role: fullAuthResponseDto.role,
    });
  }
}
