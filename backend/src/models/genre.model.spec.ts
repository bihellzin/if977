import { Repository } from 'typeorm';
import Database from '../databases';
import { Genre } from './genre.model';

let genreRepository: Repository<Genre>;

describe('Schema Suite', () => {
  beforeAll(async () => {
    const connection = await Database.createConnection();
    genreRepository = connection.getRepository(Genre);
  });

  async function genGenre(size = 0) {
    const genre = new Genre();
    genre.name = ' '.repeat(size);
    await genreRepository.save(genre);
    return genre;
  }

  it('Genre length less 1 expect validation fail', async () => {
    let error;
    try {
      const genre = await genGenre(0);
      await genreRepository.save(genre);
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeUndefined();
  });

  it('Genre length equal 1 expect validation success', async () => {
    let error;
    try {
      const genre = await genGenre(1);
      await genreRepository.save(genre);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });

  it('Genre equal length 127 expect validation success', async () => {
    let error;
    try {
      const genre = await genGenre(127);
      await genreRepository.save(genre);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });

  it('Genre equal length 255 expect validation success', async () => {
    let error;
    try {
      const genre = await genGenre(255);
      await genreRepository.save(genre);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });

  it('Genre greater length 255 expect validation fail', async () => {
    let error;
    try {
      const genre = await genGenre(256);
      await genreRepository.save(genre);
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeUndefined();
  });
});
