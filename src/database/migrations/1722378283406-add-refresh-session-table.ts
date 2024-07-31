import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshSessionTable1722378283406 implements MigrationInterface {
  name = 'AddRefreshSessionTable1722378283406';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_sessions"
       (
           "id"            SERIAL            NOT NULL,
           "refresh_token" uuid              NOT NULL DEFAULT uuid_generate_v4(),
           "user_agent"    character varying NOT NULL,
           "fingerprint"   character varying NOT NULL,
           "ip"            character varying NOT NULL,
           "expires_at"    TIMESTAMP         NOT NULL,
           "created_at"    TIMESTAMP         NOT NULL DEFAULT now(),
           "user_uuid"     uuid,
           CONSTRAINT "PK_9190032f6967b7971dca07d69f3" PRIMARY KEY ("id")
       )`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_sessions"
          ADD CONSTRAINT "FK_3f3d0a296092e6892fed9d39388" FOREIGN KEY ("user_uuid") REFERENCES "users" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_sessions"
          DROP CONSTRAINT "FK_3f3d0a296092e6892fed9d39388"`,
    );
    await queryRunner.query(`DROP TABLE "refresh_sessions"`);
  }
}
