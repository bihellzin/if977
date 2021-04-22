import {
  Connection,
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from 'typeorm';
import { join } from 'path';

class Database {
  static connection: Connection;

  static async getConnection() {
    if (Database.connection == null || !Database.connection.isConnected) {
      await createConnection();
    }
    return Database.connection;
  }

  static async createConnection() {
    if (Database.connection == null || !Database.connection.isConnected) {
      const env = process.env.NODE_ENV;
      const defaultOptions = await getConnectionOptions();
      Database.connection = await createConnection(
        env === 'production'
          ? ({
              type: 'postgres',
              url: process.env.DATABASE_URL,
              synchronize: true,
              logging: false,
              dropSchema: true,
              entities: [join(__dirname, '..', 'models/*.model.js')],
              migrations: [join(__dirname, 'migration/**/*.js')],
              subscribers: [join(__dirname, 'subscriber/**/*.js')],
            } as ConnectionOptions)
          : defaultOptions,
      );
      await Database.connection.runMigrations();
    }
    return Database.connection;
  }
}

export default Database;
