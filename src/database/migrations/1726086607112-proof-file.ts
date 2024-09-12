import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProofFile1726086607112 implements MigrationInterface {
  name = 'ProofFile1726086607112';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "proof_files" ADD "mimetype" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "proof_files" ADD "size" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "proof_files" ADD "originalname" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "proof_files" DROP COLUMN "originalname"`,
    );
    await queryRunner.query(`ALTER TABLE "proof_files" DROP COLUMN "size"`);
    await queryRunner.query(`ALTER TABLE "proof_files" DROP COLUMN "mimetype"`);
  }
}
