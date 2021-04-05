import { MigrationInterface, QueryRunner } from 'typeorm';

export class createMatches1616865116063 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      CREATE TABLE IF NOT EXISTS matches (
        "roomCode" UUID NOT NULL,
        "round" INTEGER NOT NULL DEFAULT 1,
        "startedAt" TIMESTAMP DEFAULT NOW(),
        "finishedAt" TIMESTAMP,
        UNIQUE ("roomCode", "round"),
        PRIMARY KEY ("roomCode", "round"),
        FOREIGN KEY ("roomCode") REFERENCES rooms ("code")
              ON UPDATE CASCADE
              ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`DROP TABLE IF EXISTS matches CASCADE;`);
  }
}
