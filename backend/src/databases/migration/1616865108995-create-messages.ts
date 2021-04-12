import { MigrationInterface, QueryRunner } from 'typeorm';

export class createMessages1616865108995 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      CREATE TABLE IF NOT EXISTS messages (
        "playerUserId" UUID NOT NULL,
        "playerRoomCode" UUID NOT NULL,
        "message" VARCHAR(255) NOT NULL,
        "sentAt" TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY ("playerUserId", "playerRoomCode", "sentAt"),
        FOREIGN KEY ("playerUserId", "playerRoomCode") REFERENCES players ("userId", "roomCode")
              ON UPDATE CASCADE
              ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`DROP TABLE IF EXISTS messages CASCADE;`);
  }
}
