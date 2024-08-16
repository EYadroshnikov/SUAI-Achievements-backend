import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSettings } from './entities/user-settings.entity';
import { Repository } from 'typeorm';
import { UpdateUserSettingsDto } from './dtos/update-user-settings.dto';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSettings)
    private readonly userSettingsRepository: Repository<UserSettings>,
  ) {}

  async get(uuid: string) {
    return this.userSettingsRepository.findOneOrFail({
      where: { user: { uuid } },
    });
  }

  async update(uuid: string, updateUserSettingsDto: UpdateUserSettingsDto) {
    return this.userSettingsRepository.update(
      { user: { uuid } },
      updateUserSettingsDto,
    );
  }
}
