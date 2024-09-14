import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCanceledStatus1726345756589 implements MigrationInterface {
  name = 'AddCanceledStatus1726345756589';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."applications_status_enum" RENAME TO "applications_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."applications_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications"
          ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications"
          ALTER COLUMN "status" TYPE "public"."applications_status_enum" USING "status"::"text"::"public"."applications_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications"
          ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."applications_status_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."applications_status_enum_old" AS ENUM('PENDING', 'APPROVED', 'REJECTED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications"
          ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications"
          ALTER COLUMN "status" TYPE "public"."applications_status_enum_old" USING "status"::"text"::"public"."applications_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications"
          ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(`DROP TYPE "public"."applications_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."applications_status_enum_old" RENAME TO "applications_status_enum"`,
    );
  }
}
