import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTriggerUpdateUser1616889531685
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        CREATE TRIGGER trigger_update_user
        BEFORE INSERT OR UPDATE ON users
        FOR EACH ROW EXECUTE PROCEDURE update_user();
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_update_user ON users;
      `);
  }
}
