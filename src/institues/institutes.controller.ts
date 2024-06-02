import { Controller, Get } from '@nestjs/common';
import { InstitutesService } from './institutes.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Institutes')
@Controller('institutes')
export class InstitutesController {
  constructor(private readonly institutesService: InstitutesService) {}

  @Get()
  async getInstitutes() {
    return this.institutesService.getAll();
  }

  // @Get('/groups/:id')
  // async getInstituteGroup(@Param('id') id: string) {}
}
