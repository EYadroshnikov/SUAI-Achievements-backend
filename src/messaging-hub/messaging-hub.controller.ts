import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MessagingHubService } from './messaging-hub.service';
import { PushAllDto } from './dto/push-all.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('messaging-hub')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MessagingHubController {
  constructor(private readonly messagingHubService: MessagingHubService) {}

  @Post('/bye-all')
  @Roles(UserRole.ADMIN)
  sendTest(@Body() body: PushAllDto) {
    return this.messagingHubService.broadcastToAllUsers(
      body.testUsers,
      body.mode,
    );
  }
}
