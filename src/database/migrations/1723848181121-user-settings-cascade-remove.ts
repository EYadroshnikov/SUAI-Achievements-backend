import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserSettingsCascadeRemove1723848181121
  implements MigrationInterface
{
  name = 'UserSettingsCascadeRemove1723848181121';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_settings" ADD "user_uuid" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user_settings" ADD CONSTRAINT "UQ_260836d0d0b24533033d3607b9d" UNIQUE ("user_uuid")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_settings" ADD CONSTRAINT "FK_260836d0d0b24533033d3607b9d" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_settings" DROP CONSTRAINT "FK_260836d0d0b24533033d3607b9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_settings" DROP CONSTRAINT "UQ_260836d0d0b24533033d3607b9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_settings" DROP COLUMN "user_uuid"`,
    );
  }
}
