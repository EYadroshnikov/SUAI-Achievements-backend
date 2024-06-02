import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateSputnikDto } from './dtos/create.sputnik.dto';
import { CuratorDto } from './dtos/curator.dto';
import { CreateStudentDto } from './dtos/create.student.dto';
import { SputnikDto } from './dtos/sputnik.dto';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { CreateCuratorDto } from './dtos/create.curator.dto';
import { StudentDto } from './dtos/student.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/curator')
  @UseInterceptors(new TransformInterceptor(CuratorDto))
  createCurator(@Body() curatorDto: CreateCuratorDto) {
    return this.usersService.createCurator(curatorDto);
  }

  @Post('/sputnik')
  @UseInterceptors(new TransformInterceptor(SputnikDto))
  async createSputnik(
    @Body() sputnikDto: CreateSputnikDto,
  ): Promise<SputnikDto> {
    return this.usersService.createSputnik(sputnikDto);
  }

  @Post('/student')
  @UseInterceptors(new TransformInterceptor(StudentDto))
  createStudent(@Body() studentDto: CreateStudentDto) {
    return this.usersService.createStudent(studentDto);
  }
}
