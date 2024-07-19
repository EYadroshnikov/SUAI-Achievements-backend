import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAvatar1721414235206 implements MigrationInterface {
  name = 'AddAvatar1721414235206';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users"
        ADD "avatar" character varying`);
    await queryRunner.query(`ALTER TABLE "issued_achievements"
        ALTER COLUMN "is_canceled" SET DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "issued_achievements"
        ALTER COLUMN "is_canceled" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "users"
        DROP COLUMN "avatar"`);
  }
}
