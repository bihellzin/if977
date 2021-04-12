import { MigrationInterface, QueryRunner } from 'typeorm';

export class createRooms1616865077912 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        "code" UUID DEFAULT uuid_generate_v4() NOT NULL UNIQUE,
        "ownerId" UUID DEFAULT uuid_generate_v4() NOT NULL,
        "theme" VARCHAR,
        "name" VARCHAR,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP,
        PRIMARY KEY ("code"),
        FOREIGN KEY ("ownerId") REFERENCES users("id")
              ON UPDATE CASCADE
              ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`DROP TABLE IF EXISTS rooms CASCADE;`);
  }
}
