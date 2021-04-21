import Database from '../databases';
import { Podium } from './podium.model';

let podiumRepository: any;

describe('Model Podium', () => {
  beforeAll(async () => {
    const connection = await Database.createConnection();
    podiumRepository = connection.getRepository(Podium);
  });

  it('Podium score less 0 expect validation fail', async () => {
    let error;
    try {
      const podium = new Podium();
      podium.score = -1;
      await podiumRepository.save(podium);
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeUndefined();
  });

  it('Podium score equal 0 expect validation fail', async () => {
    let error;
    try {
      const podium = new Podium();
      podium.score = 0;
      await podiumRepository.save(podium);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });

  it('Podium score equal 5 expect validation fail', async () => {
    let error;
    try {
      const podium = new Podium();
      podium.score = 5;
      await podiumRepository.save(podium);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });

  it('Podium score equal 9 expect validation fail', async () => {
    let error;
    try {
      const podium = new Podium();
      podium.score = 9;
      await podiumRepository.save(podium);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });

  it('Podium score greater 9 expect validation fail', async () => {
    let error;
    try {
      const podium = new Podium();
      podium.score = 10;
      await podiumRepository.save(podium);
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeUndefined();
  });
});
