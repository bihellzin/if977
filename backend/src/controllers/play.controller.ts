import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import levenshtein from 'js-levenshtein';
import HttpException, { asyncHandler } from '../middlewares/errorHandler';
import { JwtAuth } from '../middlewares/passport';
import { Play } from '../models/play.model';
import { Room } from '../models/room.model';
import { Music } from './../models/music.model';
import { Podium } from './../models/podium.model';
import { User } from '../models/user.model';

export class PlayController {
  public router = Router();
  public path = '/play';

  constructor() {
    this.router.get(this.path, JwtAuth, asyncHandler(this.findAll));
    this.router.get(`${this.path}/:id`, JwtAuth, asyncHandler(this.findOne));
    this.router.post(this.path, JwtAuth, asyncHandler(this.create));
    this.router.put(`${this.path}/:id`, JwtAuth, asyncHandler(this.update));
    this.router.delete(`${this.path}/:id`, JwtAuth, asyncHandler(this.delete));
  }

  async findAll(req: Request, res: Response) {
    const offset = parseInt((req.query.offset as string) || '0');
    const limit = Math.max(parseInt((req.query.limit as string) || '5'), 25);
    const roomRepository = getRepository(Room);
    const [data, total] = await roomRepository.findAndCount({
      skip: offset,
      take: limit,
    });
    return res.status(200).json({ total, offset, limit, data });
  }

  async findOne(req: Request, res: Response) {
    const playRepository = getRepository(Play);
    const play = await playRepository.findOne(req.params.id);
    if (!play) {
      throw new HttpException(404, 'Play not found!');
    }
    return res.status(200).json({ data: play });
  }

  async create(req: Request, res: Response) {
    const { answer = '', roomId, musicId } = req.body;
    const playRepository = getRepository(Play);
    const roomRepository = getRepository(Room);
    const musicRepository = getRepository(Music);
    const podiumRepository = getRepository(Podium);
    const play = playRepository.create();
    const room = await roomRepository.findOne(roomId);
    if (!room) {
      throw new HttpException(404, 'Room not found!');
    }
    play.room = room;
    const music = await musicRepository.findOne(musicId);
    if (!music) {
      throw new HttpException(404, 'Music not found!');
    }
    play.user = req.user as User;
    play.music = music;
    play.accuracy = this.calcAccuracy(answer, music.name);
    // Set podium
    if ((play.accuracy = 100.0)) {
      const { maxPodium } = await podiumRepository.query(
        'SELECT MAX(R.id) AS maxPodium FROM podium R',
      );
      const { currentPodium } = await playRepository.query(
        `
          SELECT COALESCE(MAX(P.podium_id), 0) + 1 AS currentPodium
          FROM play P
              JOIN room R ON R.id = P.room_id
          WHERE P.musicId = $1
              AND P.roomId = $2
              AND P.createdAt > R.startedAt
          `,
        [music.id, room.id],
      );
      const podium = await podiumRepository.findOne(
        Math.min(maxPodium, currentPodium),
      );
      if (!podium) {
        throw new HttpException(404, 'Podium not found!');
      }
      play.podium = podium;
    }
    const data = await playRepository.save(play);
    return res.status(201).json({ data });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { answer, roomId, musicId } = req.body;
    const playRepository = getRepository(Play);
    const roomRepository = getRepository(Room);
    const musicRepository = getRepository(Music);
    const podiumRepository = getRepository(Podium);
    const play = await playRepository.findOne(id);
    if (!play) {
      throw new HttpException(404, 'Play not found!');
    }
    const room = await roomRepository.findOne(roomId);
    if (!room) {
      throw new HttpException(404, 'Room not found!');
    }
    const music = await musicRepository.findOne(musicId);
    if (!music) {
      throw new HttpException(404, 'Music not found!');
    }
    play.user = req.user as User;
    play.music = music;
    play.accuracy = this.calcAccuracy(answer, music.name);
    // Set podium
    if ((play.accuracy = 100.0)) {
      const { maxPodium } = await podiumRepository.query(
        'SELECT MAX(R.id) AS maxPodium FROM podium R',
      );
      const { currentPodium } = await playRepository.query(
        `
          SELECT COALESCE(MAX(P.podium_id), 0) + 1 AS currentPodium
          FROM play P
              JOIN room R ON R.id = P.room_id
          WHERE P.musicId = $1
              AND P.roomId = $2
              AND P.createdAt > R.startedAt
          `,
        [music.id, room.id],
      );
      const podium = await podiumRepository.findOne(
        Math.min(maxPodium, currentPodium),
      );
      if (!podium) {
        throw new HttpException(404, 'Podium not found!');
      }
      play.podium = podium;
    }
    const data = await playRepository.save(play);
    // Reset podium
    const { win } = await playRepository.query(
      `
          SELECT COALESCE(SUM(R.score), 0) >= 120 AS win
            FROM play P
                JOIN podium R ON R.id = P.podiumId
                JOIN room R1 ON R1.id = P.roomId AND R1.startedAt < P.createdAt
            WHERE P.userId = $1 AND P.room_id = $2;
    `,
      [play.user.id, play.room.id],
    );
    if (win) {
      await playRepository.query(
        `
          DELETE FROM play P
          WHERE P.roomId = $1
              AND P.userId != $2
              AND P.podiumId IS NOT NULL
              AND P.createdAt < $4;
      `,
        [play.room.id, play.user.id, play.createdAt],
      );
      await playRepository.query(
        `
          UPDATE room
          SET startedAt = $1
          WHERE id = $2;
      `,
        [play.createdAt, play.room.id],
      );
    }
    return res.status(200).json({ data });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const playRepository = getRepository(Play);
    const play = await playRepository.findOne(id);
    if (!play) {
      throw new HttpException(404, 'Play not found!');
    }
    const result = await playRepository.findOne(id);
    return res.status(200).json({ data: Boolean(result) });
  }

  calcAccuracy(a: string, b: string) {
    const unnacentA = a
      .toLowerCase()
      .normalize('NFD')
      .replace(/[^a-z]/g, '');
    const unnacentB = b
      .toLowerCase()
      .normalize('NFD')
      .replace(/[^a-z]/g, '');
    const maxlength = Math.max(unnacentA.length, unnacentB.length);
    const diff = levenshtein(unnacentA, unnacentB);
    return ((maxlength - diff) / maxlength) * 100;
  }
}
