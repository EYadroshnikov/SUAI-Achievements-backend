import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { TransformInterceptor } from '../../interceptors/transform.interceptor';
import { CuratorDto } from '../dtos/curator.dto';
import { CreateCuratorDto } from '../dtos/create.curator.dto';
import { TransformCreatedApiResponse } from '../../decorators/transform-created-api-response.decorator';

@ApiTags('curators')
@Controller()
export class CuratorsController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/curator')
  @TransformCreatedApiResponse(CuratorDto)
  async createCurator(@Body() curatorDto: CreateCuratorDto) {
    return this.usersService.createCurator(curatorDto);
  }

  @Get('/institutes/:id/curators')
  @ApiOkResponse({ type: CuratorDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(CuratorDto))
  async getCuratorsByInstitute(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getCuratorsByInstitute(id);
  }
}
