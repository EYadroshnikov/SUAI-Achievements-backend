import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Institute } from './entities/institute.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InstitutesService {
  constructor(
    @InjectRepository(Institute)
    private readonly instituteRepository: Repository<Institute>,
  ) {}

  async findOne(id: number) {
    return this.instituteRepository.findOneOrFail({ where: { id } });
  }

  async getAll(): Promise<Institute[]> {
    return this.instituteRepository.find();
  }
}
