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
      const defaultOptions = await getConnectionOptions();

      Database.connection = await createConnection(
        Object.assign(defaultOptions, {
          type: 'sqlite',
          database: ':memory:',
          synchronize: true,
          dropSchema: process.env.NODE_ENV == 'test',
          logging: process.env.NODE_ENV != 'test',
          ...(process.env.NODE_ENV == 'production'
            ? { type: 'postgres', url: process.env.DATABASE_URL }
            : {}),
        } as ConnectionOptions),
      );
    }
    return Database.connection;
  }
}

export default Database;
