import { Repository } from 'typeorm';
import Database from '../databases';
import { User } from './user.model';
import { Room } from './room.model';
import { Play } from './play.model';
import { Genre } from './genre.model';
import { Music } from './music.model';

let playRepository: Repository<Play>;

let user: User;
let genre: Genre;
let room: Room;
let music: Music;

describe('Schema Suite', () => {
  beforeAll(async () => {
    const connection = await Database.createConnection();
    playRepository = connection.getRepository(Play);

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

    music = new Music();
    music.name = 'Nós';
    music.author = 'Djonga';
    music.url = 'song.mp3';
    music.genre = genre;
    await connection.getRepository(Music).save(music);
  });

  async function genPlay(size = 0) {
    const play = new Play();
    play.answer = ' '.repeat(size);
    play.room = room;
    play.user = user;
    play.music = music;
    await playRepository.save(play);

    return play;
  }

  it('Answer length less 1 expect validation fail', async () => {
    let error;
    try {
      const play = await genPlay(0);
      await playRepository.save(play);
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeUndefined();
  });

  it('Answer length equal 1 expect validation success', async () => {
    let error;
    try {
      const play = await genPlay(1);
      await playRepository.save(play);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });

  it('Answer equal length 127 expect validation success', async () => {
    let error;
    try {
      const play = await genPlay(127);
      await playRepository.save(play);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });

  it('Answer equal length 255 expect validation success', async () => {
    let error;
    try {
      const play = await genPlay(255);
      await playRepository.save(play);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });

  it('Answer greater length 255 expect validation fail', async () => {
    let error;
    try {
      const play = await genPlay(256);
      await playRepository.save(play);
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeUndefined();
  });
});
