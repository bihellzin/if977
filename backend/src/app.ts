import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createSocket } from './services/socket';
import createConnection from './databases';

const clientURL = process.env.CLIENT_URL || '*';

const app = express();
app.use(cors({ origin: clientURL }));
app.use(helmet());
createConnection();

app.addListener('listen', (server: Express.Application) => {
  createSocket(server, {
    cors: { origin: clientURL },
  });
});

export default app;
