import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SputnikDto } from '../dtos/sputnik.dto';
import { CreateSputnikDto } from '../dtos/create.sputnik.dto';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor';
import { AuthorizedRequestDto } from '../../common/dtos/authorized.request.dto';

@ApiTags('Sputniks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class SputniksController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/sputniks')
  @ApiOperation({ summary: 'can access: curator' })
  @Roles(UserRole.CURATOR, UserRole.ADMIN)
  @ApiCreatedResponse({ type: SputnikDto })
  @UseInterceptors(new TransformInterceptor(SputnikDto))
  async createSputnik(
    @Body() sputnikDto: CreateSputnikDto,
  ): Promise<SputnikDto> {
    return this.usersService.createSputnik(sputnikDto);
  }

  @Get('/groups/:id/sputniks')
  @ApiOperation({ summary: 'can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiOkResponse({ type: SputnikDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(SputnikDto))
  async getSputniksByGroup(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getSputniksByGroup(id);
  }

  @Get('/institutes/:id/sputniks')
  @ApiOperation({ summary: 'can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiOkResponse({ type: SputnikDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(SputnikDto))
  async getSputniksByInstitute(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getSputniksByInstitute(id);
  }

  @Get('/sputniks/me')
  @ApiOperation({ summary: 'can access: sputnik' })
  @Roles(UserRole.SPUTNIK)
  @ApiOkResponse({ type: SputnikDto })
  @UseInterceptors(new TransformInterceptor(SputnikDto))
  async getMe(@Req() req: AuthorizedRequestDto) {
    return this.usersService.getSputnik(req.user.uuid);
  }
}
