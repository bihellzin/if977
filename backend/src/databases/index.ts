import {
  Connection,
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from 'typeorm';

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
        Object.assign(
          defaultOptions,
          env === 'production'
            ? ({
                url: process.env.DATABASE_URL,
                synchronize: true,
                logging: false,
                dropSchema: true,
                entities: ['./dist/models/*.model.js'],
                migrations: ['./dist/databases/migration/**/*.js'],
                subscribers: ['./dist/databases/subscriber/**/*.js'],
              } as ConnectionOptions)
            : defaultOptions,
        ),
      );
      await Database.connection.runMigrations();
    }
    return Database.connection;
  }
}

export default Database;
