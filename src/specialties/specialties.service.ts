import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Speciality } from './enities/speciality.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpecialtiesService {
  constructor(
    @InjectRepository(Speciality)
    private readonly specialityRepository: Repository<Speciality>,
  ) {}
  async findOne(id: number) {
    return this.specialityRepository.findOneOrFail({ where: { id } });
  }

  async getSpecialitiesByInstituteId(id: number) {
    return this.specialityRepository.find({ where: { institute: { id } } });
  }
}
