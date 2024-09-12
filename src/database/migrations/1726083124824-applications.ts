import { MigrationInterface, QueryRunner } from 'typeorm';

export class Applications1726083124824 implements MigrationInterface {
  name = 'Applications1726083124824';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."applications_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "applications"
       (
           "uuid"             uuid                                NOT NULL DEFAULT uuid_generate_v4(),
           "status"           "public"."applications_status_enum" NOT NULL DEFAULT 'PENDING',
           "rejection_reason" character varying,
           "created_at"       TIMESTAMP                           NOT NULL DEFAULT now(),
           "updated_at"       TIMESTAMP                           NOT NULL DEFAULT now(),
           "student_uuid"     uuid,
           "achievement_uuid" uuid,
           CONSTRAINT "PK_aac5f90716673aca57b6afdf433" PRIMARY KEY ("uuid")
       )`,
    );
    await queryRunner.query(
      `CREATE TABLE "proof_files"
       (
           "uuid"             uuid              NOT NULL DEFAULT uuid_generate_v4(),
           "type"             character varying NOT NULL,
           "file_name"        character varying NOT NULL,
           "application_uuid" uuid,
           CONSTRAINT "PK_3039e55c2af04c6081573e5416b" PRIMARY KEY ("uuid")
       )`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications"
          ADD CONSTRAINT "FK_48c413a11e0a3d0fdb8826b5088" FOREIGN KEY ("student_uuid") REFERENCES "users" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications"
          ADD CONSTRAINT "FK_2e0416e3f2bebd24b6bf22f99c6" FOREIGN KEY ("achievement_uuid") REFERENCES "achievements" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "proof_files"
          ADD CONSTRAINT "FK_09a4ea2f9195e0841a71765748b" FOREIGN KEY ("application_uuid") REFERENCES "applications" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "proof_files"
          DROP CONSTRAINT "FK_09a4ea2f9195e0841a71765748b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications"
          DROP CONSTRAINT "FK_2e0416e3f2bebd24b6bf22f99c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications"
          DROP CONSTRAINT "FK_48c413a11e0a3d0fdb8826b5088"`,
    );
    await queryRunner.query(`DROP TABLE "proof_files"`);
    await queryRunner.query(`DROP TABLE "applications"`);
    await queryRunner.query(`DROP TYPE "public"."applications_status_enum"`);
  }
}
