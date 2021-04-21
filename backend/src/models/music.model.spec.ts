import Database from '../databases';
import { Genre } from './genre.model';
import { Music } from './music.model';

let genreRepository: any;
let musicRepository: any;

let genre: Genre;
let music: Music;

describe('Model Room', () => {
  beforeAll(async () => {
    const connection = await Database.createConnection();
    genreRepository = connection.getRepository(Genre);
    musicRepository = connection.getRepository(Music);

    genre = new Genre();
    genre.name = "Rosque";
    await genreRepository.save(genre);
  });

  

  it('Music has to have a Genre success', async () => {
    let error;
    try {
      music = new Music();
      music.genre = genre;
      music.name = "Baile de Chatuba";
      music.url = "song.mp3";
      music.author = "Mc Staylon"
      await musicRepository.save(music);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });


  it('Music has to have a name failed', async () => {
    let error;
    try {
        music = new Music();
        music.genre = genre;
        music.url = "song.mp3";
        music.author = "Mc Staylon"
        await musicRepository.save(music);
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeUndefined();
  });

  it('Music has to have an url failed', async () => {
    let error;
    try {
        music = new Music();
        music.genre = genre;
        music.name = "Baile de Chatuba";
        music.author = "Mc Staylon"
        await musicRepository.save(music);
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeUndefined();
  });

  it('Music has to have an author failed', async () => {
    let error;
    try {
        music = new Music();
        music.genre = genre;
        music.name = "Baile de Chatuba";
        music.url = "song.mp3";
        await musicRepository.save(music);
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeUndefined();
  });




});
