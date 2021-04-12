import { MigrationInterface, QueryRunner } from 'typeorm';

export class createPlays1616865150225 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      CREATE TABLE IF NOT EXISTS plays (
        "playerUserId" UUID NOT NULL,
        "playerRoomCode" UUID NOT NULL,
        "matchRoomCode" UUID NOT NULL,
        "matchRound" INTEGER NOT NULL,
        "musicUrl" VARCHAR(255) NOT NULL,
        "answer" VARCHAR(255),
        "accuracy" DECIMAL(5, 2) DEFAULT 0,
        "position" INTEGER,
        "answeredAt" TIMESTAMP DEFAULT NOW(),
        UNIQUE ("playerUserId", "playerRoomCode", "matchRoomCode", "matchRound", "musicUrl", "answeredAt"),
        PRIMARY KEY ("playerUserId", "playerRoomCode", "matchRoomCode", "matchRound", "musicUrl", "answeredAt"),
        FOREIGN KEY ("playerUserId", "playerRoomCode") REFERENCES players("userId", "roomCode")
              ON UPDATE CASCADE
              ON DELETE CASCADE,
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
    return queryRunner.query(`DROP TABLE IF EXISTS plays CASCADE;`);
  }
}
