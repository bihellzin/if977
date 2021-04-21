import App from './app';
import { AuthController } from './controllers/auth.controller';
import { GenreController } from './controllers/genre.controller';
import { MessageController } from './controllers/message.controller';
import { MusicController } from './controllers/music.controller';
import { PlayController } from './controllers/play.controller';
import { RoomController } from './controllers/room.controller';
import { UserController } from './controllers/user.controller';

const app = new App([
  new AuthController(),
  new UserController(),
  new RoomController(),
  new MessageController(),
  new MusicController(),
  new PlayController(),
  new GenreController(),
]);

app.listen();
