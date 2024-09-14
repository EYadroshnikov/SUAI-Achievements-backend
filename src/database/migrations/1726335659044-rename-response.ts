import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameResponse1726335659044 implements MigrationInterface {
  name = 'RenameResponse1726335659044';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applications"
          RENAME COLUMN "rejection_reason" TO "response"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applications"
          RENAME COLUMN "response" TO "rejection_reason"`,
    );
  }
}
