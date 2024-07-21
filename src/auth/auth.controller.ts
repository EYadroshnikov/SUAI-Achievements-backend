import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/auth.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { TgAuthDto } from './dtos/tg-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthResponseDto })
  async login(@Body() authDto: AuthDto): Promise<AuthResponseDto> {
    return await this.authService.validateUser(authDto);
  }

  @Post('/tg/login')
  @ApiOkResponse({ type: AuthResponseDto })
  async tgLogin(@Body() tgAuthDto: TgAuthDto) {
    return this.authService.validateTgUser(tgAuthDto);
  }
}
