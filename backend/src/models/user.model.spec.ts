import { Repository } from 'typeorm';
import Database from '../databases';
import { User } from './user.model';

let userRepository: Repository<User>;

describe('Schema Suite', () => {
  beforeAll(async () => {
    const connection = await Database.createConnection();
    userRepository = connection.getRepository(User);
  });

  it('Nickname length less 3 expect validation fail', async () => {
    let error;
    try {
      const user = new User();
      user.nickname = '12';
      await userRepository.save(user);
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeUndefined();
  });

  it('Nickname length equal 3 expect validation success', async () => {
    let error;
    try {
      const user = new User();
      user.nickname = '123';
      await userRepository.save(user);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });

  it('Nickname equal length 5 expect validation success', async () => {
    let error;
    try {
      const user = new User();
      user.nickname = '12345';
      await userRepository.save(user);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });

  it('Nickname equal length 8 expect validation success', async () => {
    let error;
    try {
      const user = new User();
      user.nickname = '12345678';
      await userRepository.save(user);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });

  it('Nickname greater length 8 expect validation fail', async () => {
    let error;
    try {
      const user = new User();
      user.nickname = '123456789';
      await userRepository.save(user);
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeUndefined();
  });
});
