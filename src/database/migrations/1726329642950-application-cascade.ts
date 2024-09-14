import { MigrationInterface, QueryRunner } from 'typeorm';

export class ApplicationCascade1726329642950 implements MigrationInterface {
  name = 'ApplicationCascade1726329642950';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "proof_files"
          DROP CONSTRAINT "FK_09a4ea2f9195e0841a71765748b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "proof_files"
          ALTER COLUMN "type" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "proof_files"
          ALTER COLUMN "mimetype" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "proof_files"
          ALTER COLUMN "size" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "proof_files"
          ALTER COLUMN "originalname" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "proof_files"
          ADD CONSTRAINT "FK_09a4ea2f9195e0841a71765748b" FOREIGN KEY ("application_uuid") REFERENCES "applications" ("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "proof_files"
          DROP CONSTRAINT "FK_09a4ea2f9195e0841a71765748b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "proof_files"
          ALTER COLUMN "originalname" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "proof_files"
          ALTER COLUMN "size" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "proof_files"
          ALTER COLUMN "mimetype" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "proof_files"
          ALTER COLUMN "type" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "proof_files"
          ADD CONSTRAINT "FK_09a4ea2f9195e0841a71765748b" FOREIGN KEY ("application_uuid") REFERENCES "applications" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
