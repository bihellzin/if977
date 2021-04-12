import { MigrationInterface, QueryRunner } from 'typeorm';

export class createGoals1616865137737 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      CREATE TABLE IF NOT EXISTS goals (
        "matchRoomCode" UUID NOT NULL,
        "matchRound" INTEGER NOT NULL,
        "musicUrl" VARCHAR(255) NOT NULL,
        "startedAt" TIMESTAMP DEFAULT NOW(),
        "finishedAt" TIMESTAMP,
        UNIQUE ("matchRoomCode", "matchRound", "musicUrl"),
        PRIMARY KEY ("matchRoomCode", "matchRound", "musicUrl"),
        FOREIGN KEY ("matchRoomCode", "matchRound") REFERENCES matches ("roomCode", "round")
              ON UPDATE CASCADE
              ON DELETE CASCADE,
        FOREIGN KEY ("musicUrl") REFERENCES musics ("url")
              ON UPDATE CASCADE
              ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`DROP TABLE IF EXISTS goals CASCADE;`);
  }
}
