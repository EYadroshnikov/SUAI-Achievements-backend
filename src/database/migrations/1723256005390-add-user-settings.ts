import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserSettings1723256005390 implements MigrationInterface {
  name = 'AddUserSettings1723256005390';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_settings"
       (
           "uuid"              uuid      NOT NULL DEFAULT uuid_generate_v4(),
           "is_visible_in_top" boolean   NOT NULL DEFAULT true,
           "created_at"        TIMESTAMP NOT NULL DEFAULT now(),
           "updated_at"        TIMESTAMP NOT NULL DEFAULT now(),
           CONSTRAINT "PK_a293a4a27ec37370f849576673c" PRIMARY KEY ("uuid")
       )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_settings"`);
  }
}
