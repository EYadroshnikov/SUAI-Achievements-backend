import { MigrationInterface, QueryRunner } from 'typeorm';

export class ApplicationMessage1726333662964 implements MigrationInterface {
  name = 'ApplicationMessage1726333662964';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applications"
          ADD "message" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applications"
        DROP COLUMN "message"`);
  }
}
