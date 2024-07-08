import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SpecialtiesService } from './specialties.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { SpecialityDto } from './dtos/speciality.dto';
import { GroupDto } from '../groups/dtos/group.dto';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('Specialities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Get('/institutes/specialities/:id')
  @ApiOperation({ summary: 'can access: curator' })
  @Roles(UserRole.CURATOR, UserRole.ADMIN)
  @UseInterceptors(new TransformInterceptor(SpecialityDto))
  @ApiOkResponse({ type: GroupDto })
  async getByInstituteId(@Param('id', ParseIntPipe) id: number) {
    return this.specialtiesService.getSpecialitiesByInstituteId(id);
  }
}
