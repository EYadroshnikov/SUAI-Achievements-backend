import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Institute } from './entities/institute.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class InstitutesService {
  constructor(
    @InjectRepository(Institute)
    private readonly instituteRepository: Repository<Institute>,
  ) {}

  async findOne(id: number, transactionEntityManager?: EntityManager) {
    const repo =
      transactionEntityManager?.getRepository(Institute) ||
      this.instituteRepository;
    return repo.findOneOrFail({ where: { id } });
  }

  async getAll(): Promise<Institute[]> {
    return this.instituteRepository.find();
  }

  async getAllWithGroups(): Promise<Institute[]> {
    return this.instituteRepository.find({ relations: ['groups'] });
  }
}
