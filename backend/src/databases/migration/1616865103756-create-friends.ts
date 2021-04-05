import { MigrationInterface, QueryRunner } from 'typeorm';

export class createFriends1616865103756 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      CREATE TABLE IF NOT EXISTS friends (
        "userId" UUID NOT NULL,
        "friendId" UUID NOT NULL,
        PRIMARY KEY ("userId", "friendId"),
        FOREIGN KEY ("userId") REFERENCES users ("id")
              ON UPDATE CASCADE
              ON DELETE CASCADE,
        FOREIGN KEY ("friendId") REFERENCES users ("id")
              ON UPDATE CASCADE
              ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`DROP TABLE IF EXISTS friends CASCADE;`);
  }
}
