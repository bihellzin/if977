import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTriggerUpdateGoal1616889712342
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        CREATE TRIGGER trigger_update_music
        BEFORE INSERT OR UPDATE ON musics
        FOR EACH ROW EXECUTE PROCEDURE update_music();
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_update_music ON musics;
      `);
  }
}
