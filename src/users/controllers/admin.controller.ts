import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { UsersService } from '../users.service';

@ApiTags('admin/users')
@Controller('admin')
export class AdminController {
  constructor(private readonly usersService: UsersService) {}
}
