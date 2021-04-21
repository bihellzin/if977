import Database from '../databases';
import { Room } from './room.model';
import { Genre } from './genre.model';
import { User } from './user.model';

let roomRepository: any;
let genreRepository: any;
let userRepository: any;

let genre: Genre;
let room: Room;
let user: User;

describe('Model Room', () => {
  beforeAll(async () => {
    const connection = await Database.createConnection();
    roomRepository = connection.getRepository(Room);
    genreRepository = connection.getRepository(Genre);
    userRepository = connection.getRepository(User)

    genre = new Genre();
    genre.name = "Rosque";
    await genreRepository.save(genre);

    user = new User();
    user.nickname = 'João';
    await userRepository.save(user);


  });

  it('Room has to have a Genre success', async () => {
    let error;
    try {
      room = new Room();
      room.genre = genre;
      room.owner = user;
      await roomRepository.save(room);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });

  it('Room has to have a Owner success', async () => {

    let error;
    try {
        room = new Room();
        room.genre = genre;
        room.owner = user;
        await roomRepository.save(room);
      } catch (e) {
        error = e;
      }
      expect(error).toBeUndefined();
  })


});
