import {
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from 'typeorm';

export default async () => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(
      defaultOptions,
      process.env.NODE_ENV != 'test'
        ? {
            type: 'sqlite',
            database: 'src/databases/db.sqlite',
            dropSchema: true,
            synchronize: true,
            logging: false,
          }
        : ({
            type: 'sqlite',
            url: undefined,
            database: ':memory:',
            dropSchema: true,
          } as ConnectionOptions),
    ),
  );
};
