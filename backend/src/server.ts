import App from './app';
import { UserController } from './controllers/user.controller';

const app = new App([new UserController()]);

app.listen();
