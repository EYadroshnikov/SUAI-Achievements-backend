import { MigrationInterface, QueryRunner } from 'typeorm';

export class TgMessage1752792771519 implements MigrationInterface {
  name = 'TgMessage1752792771519';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "telegram_message"
       (
           "uuid"       uuid              NOT NULL DEFAULT uuid_generate_v4(),
           "tg_user_id" character varying NOT NULL,
           "message"    character varying NOT NULL,
           "created_at" TIMESTAMP         NOT NULL DEFAULT now(),
           CONSTRAINT "PK_a377e7e6006b63a53edf14b2555" PRIMARY KEY ("uuid")
       )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "telegram_message"`);
  }
}
