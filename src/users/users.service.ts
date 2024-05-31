import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  //   constructor(
  //     @InjectRepository(User)
  //     private readonly userRepository: Repository<User>,
  //     @InjectRepository(Institute)
  //     private readonly instituteRepository: Repository<Institute>,
  //     @InjectRepository(Group)
  //     private readonly groupRepository: Repository<Group>,
  //   ) {
  //   }
  //
  //   async createUser(data: any): Promise<User> {
  //     // Парсинг данных
  //     const { vkId, firstName, lastName, patronymic, role, instituteId, groupId } = data;
  //
  //     // Создание нового пользователя
  //     const user = new User();
  //     user.vkId = vkId;
  //     user.firstName = firstName;
  //     user.lastName = lastName;
  //     user.patronymic = patronymic;
  //     user.role = role;
  //
  //     // Получение института по ID
  //     const institute = await this.instituteRepository.findOne({ id: instituteId });
  //     if (!institute) {
  //       throw new Error('Institute not found');
  //     }
  //     user.institute = institute;
  //
  //     // Если пользователь имеет роль sputnik, то назначаем его в группу
  //     if (role === UserRole.SPUTNIK) {
  //       const group = await this.groupRepository.findOne({ id: groupId });
  //       if (!group) {
  //         throw new Error('Group not found');
  //       }
  //       user.group = group;
  //     }
  //
  //     // Сохранение пользователя в базе данных
  //     return await this.userRepository.save(user);
  //   }
  // }
}
