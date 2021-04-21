import { Repository } from 'typeorm';
import Database from '../databases';
import { User } from './user.model';
import { Room } from './room.model';
import { Message } from './message.model';
import { Genre } from './genre.model';

let messageRepository: Repository<Message>;

let user: User;
let genre: Genre;
let room: Room;

describe('Schema Suite', () => {
  beforeAll(async () => {
    const connection = await Database.createConnection();
    messageRepository = connection.getRepository(Message);

    user = new User();
    user.nickname = 'João';
    await connection.getRepository(User).save(user);

    genre = new Genre();
    genre.name = 'Fórro';
    await connection.getRepository(Genre).save(genre);

    room = new Room();
    room.owner = user;
    room.genre = genre;
    await connection.getRepository(Room).save(room);
  });

  async function genMessage(size = 0) {
    const message = new Message();
    message.content = ' '.repeat(size);
    message.room = room;
    message.user = user;
    await messageRepository.save(message);

    return message;
  }

  it('Message length less 1 expect validation fail', async () => {
    let error;
    try {
      const message = await genMessage(0);
      await messageRepository.save(message);
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeUndefined();
  });

  it('Message length equal 1 expect validation success', async () => {
    let error;
    try {
      const message = await genMessage(1);
      await messageRepository.save(message);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });

  it('Message equal length 127 expect validation success', async () => {
    let error;
    try {
      const message = await genMessage(127);
      await messageRepository.save(message);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });

  it('Message equal length 255 expect validation success', async () => {
    let error;
    try {
      const message = await genMessage(255);
      await messageRepository.save(message);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });

  it('Message greater length 255 expect validation fail', async () => {
    let error;
    try {
      const message = await genMessage(256);
      await messageRepository.save(message);
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeUndefined();
  });
});
