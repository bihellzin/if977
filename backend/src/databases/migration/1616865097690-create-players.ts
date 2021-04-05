import { MigrationInterface, QueryRunner } from 'typeorm';

export class createPlayers1616865097690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      CREATE TABLE IF NOT EXISTS players (
        "userId" UUID NOT NULL,
        "roomCode" UUID NOT NULL,
        "joinedAt" TIMESTAMP DEFAULT NOW(),
        "exitedAt" TIMESTAMP,
        UNIQUE ("userId", "roomCode"),
        PRIMARY KEY ("userId", "roomCode"),
        FOREIGN KEY ("userId") REFERENCES users ("id")
              ON UPDATE CASCADE
              ON DELETE CASCADE,
        FOREIGN KEY ("roomCode") REFERENCES rooms ("code")
              ON UPDATE CASCADE
              ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`DROP TABLE IF EXISTS players CASCADE;`);
  }
}
