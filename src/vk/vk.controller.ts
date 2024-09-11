import { Controller, Post, UseGuards } from '@nestjs/common';
import { VkService } from './vk.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('VK')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vk')
export class VkController {
  constructor(private readonly vkService: VkService) {}

  @Post('check-push-permissions')
  @ApiOperation({ summary: 'can access: admin only' })
  @Roles(UserRole.ADMIN)
  async checkPushPermissions() {
    return this.vkService.checkPushPermissions();
  }
}
