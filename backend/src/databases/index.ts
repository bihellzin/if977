import {
  Connection,
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from 'typeorm';

class Database {
  static connection: Connection;

  static async getConnection() {
    return Database.connection;
  }

  static async createConnection() {
    if (Database.connection == null) {
      const defaultOptions = await getConnectionOptions();

      Database.connection = await createConnection(
        Object.assign(defaultOptions, {
          type: 'postgres',
          url: process.env.DATABASE_URL,
          synchronize: true,
          dropSchema: process.env.NODE_ENV == 'test',
          // logging: process.env.NODE_ENV != 'test',
        } as ConnectionOptions),
      );
    }
    return Database.connection;
  }
}

export default Database;
