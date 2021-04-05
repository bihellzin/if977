import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTriggerUpdateRoom1616889626434
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        CREATE TRIGGER trigger_update_room
        BEFORE INSERT OR UPDATE ON rooms
        FOR EACH ROW EXECUTE PROCEDURE update_room();
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_update_room ON rooms;
      `);
  }
}
