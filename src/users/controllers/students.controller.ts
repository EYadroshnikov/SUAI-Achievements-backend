import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { TransformInterceptor } from '../../interceptors/transform.interceptor';
import { StudentDto } from '../dtos/student.dto';
import { CreateStudentDto } from '../dtos/create.student.dto';
import { TransformCreatedApiResponse } from '../../decorators/transform-created-api-response.decorator';
import { UpdateResult } from 'typeorm';

@ApiTags('students')
@Controller()
export class StudentsController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/students')
  @TransformCreatedApiResponse(StudentDto)
  async createStudent(@Body() studentDto: CreateStudentDto) {
    return this.usersService.createStudent(studentDto);
  }

  @Patch('students/:uuid/ban')
  @ApiOkResponse({ type: UpdateResult })
  async banStudent(@Param('uuid') uuid: string) {
    return this.usersService.banStudent(uuid);
  }

  @Patch('students/:uuid/unban')
  @ApiOkResponse({ type: UpdateResult })
  async unbanStudent(@Param('uuid') uuid: string) {
    return this.usersService.unbanStudent(uuid);
  }

  @Get('/groups/:id/students')
  @ApiOkResponse({ type: StudentDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(StudentDto))
  async getStudentsByGroup(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getStudentsByGroup(id);
  }

  @Get('/institutes/:id/students')
  @ApiOkResponse({ type: StudentDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(StudentDto))
  async getStudentsByInstitute(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getStudentsByInstitute(id);
  }
}
