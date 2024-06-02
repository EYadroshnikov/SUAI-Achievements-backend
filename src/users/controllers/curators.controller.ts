import { ApiTags } from '@nestjs/swagger';
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

@ApiTags('curators')
@Controller()
export class CuratorsController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/curator')
  @UseInterceptors(new TransformInterceptor(CuratorDto))
  async createCurator(@Body() curatorDto: CreateCuratorDto) {
    return this.usersService.createCurator(curatorDto);
  }

  @Get('/institutes/:id/curators')
  @UseInterceptors(new TransformInterceptor(CuratorDto))
  async getCuratorsByInstitute(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getCuratorsByInstitute(id);
  }
}
