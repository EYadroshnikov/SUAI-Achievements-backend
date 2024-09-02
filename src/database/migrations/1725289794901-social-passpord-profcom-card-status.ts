import { MigrationInterface, QueryRunner } from 'typeorm';

export class SocialPasspordProfcomCardStatus1725289794901
  implements MigrationInterface
{
  name = 'SocialPasspordProfcomCardStatus1725289794901';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Удаляем значение по умолчанию
    await queryRunner.query(
      `ALTER TABLE "social_passport"
          ALTER COLUMN "profcom_card_status" DROP DEFAULT`,
    );

    // Временно меняем тип колонки на text
    await queryRunner.query(
      `ALTER TABLE "social_passport"
          ALTER COLUMN "profcom_card_status" TYPE text USING "profcom_card_status"::text`,
    );

    // Обновляем все старые значения на дефолтное значение нового enum
    await queryRunner.query(
      `UPDATE "social_passport"
       SET "profcom_card_status" = 'NOT_DOWNLOADED'
       WHERE "profcom_card_status" IS NOT NULL`,
    );

    // Создаем новый ENUM тип
    await queryRunner.query(
      `CREATE TYPE "social_passport_profcom_card_status_enum_new" AS ENUM('NOT_DOWNLOADED', 'REGISTERED', 'CONFIRMED')`,
    );

    // Меняем тип колонки на новый ENUM тип
    await queryRunner.query(
      `ALTER TABLE "social_passport"
          ALTER COLUMN "profcom_card_status" TYPE "social_passport_profcom_card_status_enum_new" USING "profcom_card_status"::text::"social_passport_profcom_card_status_enum_new"`,
    );

    // Устанавливаем значение по умолчанию для новой колонки
    await queryRunner.query(
      `ALTER TABLE "social_passport"
          ALTER COLUMN "profcom_card_status" SET DEFAULT 'NOT_DOWNLOADED'`,
    );

    // Удаляем старый ENUM тип
    await queryRunner.query(
      `DROP TYPE "social_passport_profcom_card_status_enum"`,
    );

    // Переименовываем новый ENUM тип в оригинальное название
    await queryRunner.query(
      `ALTER TYPE "social_passport_profcom_card_status_enum_new" RENAME TO "social_passport_profcom_card_status_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Создаем старый ENUM тип
    await queryRunner.query(
      `CREATE TYPE "social_passport_profcom_card_status_enum_old" AS ENUM('NO', 'PHOTO_PROVIDED', 'RECEIVED')`,
    );

    // Временно меняем тип колонки на text
    await queryRunner.query(
      `ALTER TABLE "social_passport"
          ALTER COLUMN "profcom_card_status" TYPE text USING "profcom_card_status"::text`,
    );

    // Меняем тип колонки на старый ENUM тип
    await queryRunner.query(
      `ALTER TABLE "social_passport"
          ALTER COLUMN "profcom_card_status" TYPE "social_passport_profcom_card_status_enum_old" USING "profcom_card_status"::text::"social_passport_profcom_card_status_enum_old"`,
    );

    // Устанавливаем значение по умолчанию для старой колонки
    await queryRunner.query(
      `ALTER TABLE "social_passport"
          ALTER COLUMN "profcom_card_status" SET DEFAULT 'NO'`,
    );

    // Удаляем новый ENUM тип
    await queryRunner.query(
      `DROP TYPE "social_passport_profcom_card_status_enum"`,
    );

    // Переименовываем старый ENUM тип в оригинальное название
    await queryRunner.query(
      `ALTER TYPE "social_passport_profcom_card_status_enum_old" RENAME TO "social_passport_profcom_card_status_enum"`,
    );
  }
}
