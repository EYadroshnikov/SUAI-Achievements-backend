import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveNotRequiredOption1724580632250
  implements MigrationInterface
{
  name = 'RemoveNotRequiredOption1724580632250';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."social_passport_medical_registration_enum" RENAME TO "social_passport_medical_registration_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_medical_registration_enum" AS ENUM('NOT_STARTED', 'NOT_ENOUGH_DOCS', 'FINISHED')`,
    );
    await queryRunner.query(`ALTER TABLE "social_passport"
        ALTER COLUMN "medical_registration" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "social_passport"
        ALTER COLUMN "medical_registration" TYPE "public"."social_passport_medical_registration_enum" USING "medical_registration"::"text"::"public"."social_passport_medical_registration_enum"`);
    await queryRunner.query(`ALTER TABLE "social_passport"
        ALTER COLUMN "medical_registration" SET DEFAULT 'NOT_STARTED'`);
    await queryRunner.query(
      `DROP TYPE "public"."social_passport_medical_registration_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."social_passport_military_registration_enum" RENAME TO "social_passport_military_registration_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_military_registration_enum" AS ENUM('NOT_STARTED', 'NOT_ENOUGH_DOCS', 'FINISHED')`,
    );
    await queryRunner.query(`ALTER TABLE "social_passport"
        ALTER COLUMN "military_registration" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "social_passport"
        ALTER COLUMN "military_registration" TYPE "public"."social_passport_military_registration_enum" USING "military_registration"::"text"::"public"."social_passport_military_registration_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."social_passport_military_registration_enum_old"`,
    );
    await queryRunner.query(`ALTER TABLE "social_passport"
        ALTER COLUMN "military_registration" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "social_passport"
        ALTER COLUMN "military_registration" SET NOT NULL`);
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_military_registration_enum_old" AS ENUM('NOT_REQUIRED', 'NOT_STARTED', 'NOT_ENOUGH_DOCS', 'FINISHED')`,
    );
    await queryRunner.query(`ALTER TABLE "social_passport"
        ALTER COLUMN "military_registration" TYPE "public"."social_passport_military_registration_enum_old" USING "military_registration"::"text"::"public"."social_passport_military_registration_enum_old"`);
    await queryRunner.query(`ALTER TABLE "social_passport"
        ALTER COLUMN "military_registration" SET DEFAULT 'NOT_REQUIRED'`);
    await queryRunner.query(
      `DROP TYPE "public"."social_passport_military_registration_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."social_passport_military_registration_enum_old" RENAME TO "social_passport_military_registration_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_medical_registration_enum_old" AS ENUM('NOT_REQUIRED', 'NOT_STARTED', 'NOT_ENOUGH_DOCS', 'FINISHED')`,
    );
    await queryRunner.query(`ALTER TABLE "social_passport"
        ALTER COLUMN "medical_registration" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "social_passport"
        ALTER COLUMN "medical_registration" TYPE "public"."social_passport_medical_registration_enum_old" USING "medical_registration"::"text"::"public"."social_passport_medical_registration_enum_old"`);
    await queryRunner.query(`ALTER TABLE "social_passport"
        ALTER COLUMN "medical_registration" SET DEFAULT 'NOT_STARTED'`);
    await queryRunner.query(
      `DROP TYPE "public"."social_passport_medical_registration_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."social_passport_medical_registration_enum_old" RENAME TO "social_passport_medical_registration_enum"`,
    );
  }
}
