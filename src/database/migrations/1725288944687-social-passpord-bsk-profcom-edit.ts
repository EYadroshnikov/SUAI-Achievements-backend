import { MigrationInterface, QueryRunner } from 'typeorm';

export class SocialPasspordBskProfcomEdit1725288944687
  implements MigrationInterface
{
  name = 'SocialPasspordBskProfcomEdit1725288944687';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."social_passport_bsk_status_enum" RENAME TO "social_passport_bsk_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_bsk_status_enum" AS ENUM('NO', 'WAITING', 'RECEIVED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_passport" ALTER COLUMN "bsk_status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_passport" ALTER COLUMN "bsk_status" TYPE "public"."social_passport_bsk_status_enum" USING "bsk_status"::"text"::"public"."social_passport_bsk_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_passport" ALTER COLUMN "bsk_status" SET DEFAULT 'NO'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."social_passport_bsk_status_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_bsk_status_enum_old" AS ENUM('NO', 'GOOGLE_FROM', 'WAITING', 'RECEIVED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_passport" ALTER COLUMN "bsk_status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_passport" ALTER COLUMN "bsk_status" TYPE "public"."social_passport_bsk_status_enum_old" USING "bsk_status"::"text"::"public"."social_passport_bsk_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_passport" ALTER COLUMN "bsk_status" SET DEFAULT 'NO'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."social_passport_bsk_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."social_passport_bsk_status_enum_old" RENAME TO "social_passport_bsk_status_enum"`,
    );
  }
}
