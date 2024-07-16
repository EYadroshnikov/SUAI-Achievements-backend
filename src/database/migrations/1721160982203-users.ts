import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1721160982203 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO users (uuid, vk_id, role, first_name, last_name, patronymic, balance, is_banned, institute_id,
                               group_id)
            VALUES (uuid_generate_v4(), 495512276, 'ADMIN', 'Егор', 'Ядрошников', 'Алексеевич', default, default, null,
                    null),
                   (uuid_generate_v4(), 303644934, 'ADMIN', 'Дмитрий', 'Коновалов', 'Владимирович', default, default, null,
                    null);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE
        WHERE vk_id IN (495512276, 303644934);
    `);
  }
}
