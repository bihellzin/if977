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
      Database.connection = await createConnection(defaultOptions);
      Database.connection.runMigrations();
    }
    return Database.connection;
  }
}

export default Database;
