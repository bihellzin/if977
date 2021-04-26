import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createSocket } from './services/socket';
import Database from './databases';
import { errorHandler } from './middlewares/errorHandler';
import { passport } from './middlewares/passport';

const clientURL = process.env.CLIENT_URL || '*';

class App {
  public app: express.Application;
  public port: number;

  constructor(
    controllers = [] as any[],
    port = parseInt(process.env.PORT || '5000', 10),
  ) {
    this.app = express();
    this.port = port;

    this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandler();
    this.initializeSocket();
  }

  private initializeMiddlewares() {
    this.app.use(cors({ origin: clientURL }));
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(passport.initialize());
  }

  private initializeControllers(controllers: any[]) {
    controllers.forEach(controller => {
      this.app.use('/', controller.router);
    });
  }

  private initializeErrorHandler() {
    this.app.use(errorHandler);
  }

  private initializeSocket() {
    this.app.addListener('listen', (server: Express.Application) => {
      console.log(process.env.NODE_ENV);
      if (process.env.NODE_ENV !== 'test') {
        const socket = createSocket(server, {
          cors: { origin: clientURL },
        });
        this.app.set('socket', socket);
      }
    });
  }

  private initializeDatabase() {
    Database.createConnection();
  }

  public listen() {
    const server = this.app.listen(this.port, () => {
      console.log(`[Server] listening at http://localhost:${this.port}`);
      this.app.emit('listen', server);
    });
  }
}

export default App;
