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
import { TransformInterceptor } from '../../interceptors/transform.interceptor';
import { SputnikDto } from '../dtos/sputnik.dto';
import { CreateSputnikDto } from '../dtos/create.sputnik.dto';
import { UsersService } from '../users.service';
import { TransformCreatedApiResponse } from '../../decorators/transform-created-api-response.decorator';

@ApiTags('sputniks')
@Controller()
export class SputniksController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/sputniks')
  @TransformCreatedApiResponse(SputnikDto)
  async createSputnik(
    @Body() sputnikDto: CreateSputnikDto,
  ): Promise<SputnikDto> {
    return this.usersService.createSputnik(sputnikDto);
  }

  @Get('/groups/:id/sputniks')
  @UseInterceptors(new TransformInterceptor(SputnikDto))
  async getSputniksByGroup(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getSputniksByGroup(id);
  }

  @Get('/institutes/:id/sputniks')
  @UseInterceptors(new TransformInterceptor(SputnikDto))
  async getSputniksByInstitute(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getSputniksByInstitute(id);
  }
}
