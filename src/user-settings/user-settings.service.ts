import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSettings } from './entities/user-settings.entity';
import { Repository } from 'typeorm';
import { AuthorizedUserDto } from '../common/dtos/authorized-user.dto';
import { UpdateUserSettingsDto } from './dtos/update-user-settings.dto';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSettings)
    private readonly userSettingsRepository: Repository<UserSettings>,
  ) {}

  async get(user: AuthorizedUserDto) {
    return this.userSettingsRepository.findOneOrFail({
      where: { user: { uuid: user.uuid } },
    });
  }

  async update(
    user: AuthorizedUserDto,
    updateUserSettingsDto: UpdateUserSettingsDto,
  ) {
    return this.userSettingsRepository.update(
      { user: { uuid: user.uuid } },
      updateUserSettingsDto,
    );
  }
}
