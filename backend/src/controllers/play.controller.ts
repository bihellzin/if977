import { Request, Response, Router } from 'express';
import { getRepository, getManager, LessThan } from 'typeorm';
import levenshtein from 'js-levenshtein';
import { asyncHandler } from '../middlewares/errorHandler';
import { JwtAuth } from '../middlewares/passport';
import { Play } from '../models/play.model';
import { Room } from '../models/room.model';
import { Music } from './../models/music.model';
import { Podium } from './../models/podium.model';
import { User } from '../models/user.model';
import { Socket } from 'socket.io';

export class PlayController {
  public router = Router();
  public path = '/play';

  constructor() {
    this.router.get(this.path, JwtAuth, asyncHandler(this.findAll));
    this.router.get(`${this.path}/:id`, JwtAuth, asyncHandler(this.findOne));
    this.router.post(this.path, JwtAuth, asyncHandler(this.create));
    this.router.patch(`${this.path}/:id`, JwtAuth, asyncHandler(this.update));
    this.router.delete(`${this.path}/:id`, JwtAuth, asyncHandler(this.delete));
  }

  async findAll(req: Request, res: Response) {
    const roomId = parseInt((req.query.roomId as string) || '0');
    const offset = parseInt((req.query.offset as string) || '0');
    const limit = Math.min(parseInt((req.query.limit as string) || '5'), 25);

    const playRepository = getRepository(Play);
    const [data, total] = await playRepository.findAndCount({
      where: { room: { id: roomId }, accuracy: LessThan(90) },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });

    return res.status(200).json({ total, offset, limit, data: data.reverse() });
  }

  async findOne(req: Request, res: Response) {
    const { id } = req.params;

    const playRepository = getRepository(Play);
    const play = await playRepository.findOneOrFail(id);

    return res.status(200).json({ data: play });
  }

  async create(req: Request, res: Response) {
    const { answer, roomId, musicId } = req.body;
    const user = req.user as User;

    const playRepository = getRepository(Play);
    const roomRepository = getRepository(Room);
    const musicRepository = getRepository(Music);
    const manager = getManager();

    const play = playRepository.create();
    play.answer = answer;
    play.user = user;
    play.room = await roomRepository.findOneOrFail(roomId);
    play.music = await musicRepository.findOneOrFail(musicId);
    play.accuracy = calcAccuracy(answer, play.music.name);

    // Verifica se acertou
    if (play.accuracy === 100.0) {
      console.log(`User ${user.id} hit music on Room ${roomId}`);
      const [{ maxPodium }] = await manager.query(
        'SELECT MAX(R.id) AS maxPodium FROM podium R',
      );
      const [{ currentPodium }] = await manager.query(
        `
          SELECT COALESCE(MAX(P.podiumId), 0) + 1 AS currentPodium
          FROM play P
              JOIN room R ON R.id = P.roomId
          WHERE P.musicId = $1
              AND P.roomId = $2
              AND P.createdAt > R.startedAt
          `,
        [play.music.id, play.room.id],
      );
      play.podium = await manager.findOneOrFail(
        Podium,
        Math.min(maxPodium, currentPodium),
      );
    }
    const data = await playRepository.save(play);
    // Reset podium
    const [{ win }] = await manager.query(
      `
          SELECT COALESCE(SUM(R.score), 0) >= 120 AS win
            FROM play P
                JOIN podium R ON R.id = P.podiumId
                JOIN room R1 ON R1.id = P.roomId AND R1.startedAt < P.createdAt
            WHERE P.userId = $1 AND P.roomId = $2;
    `,
      [play.user.id, play.room.id],
    );
    if (win) {
      await manager.query(
        `
          DELETE FROM play P
          WHERE P.roomId = $1
              AND P.userId != $2
              AND P.podiumId IS NOT NULL
              AND P.createdAt < $3;
      `,
        [play.room.id, play.user.id, play.room.startedAt],
      );
      await manager.query(`UPDATE room SET startedAt = $1 WHERE id = $2;`, [
        play.createdAt,
        play.room.id,
      ]);
    }
    const socket = req.app.get('socket') as Socket;
    if (socket) socket.to(`${play.room.id}`).emit('plays');

    return res.status(201).json({ data });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { answer, roomId, musicId } = req.body;
    const user = req.user as User;

    const playRepository = getRepository(Play);
    const roomRepository = getRepository(Room);
    const musicRepository = getRepository(Music);
    const manager = getManager();

    const play = await playRepository.findOneOrFail(id);
    play.user = user;
    if (musicId) {
      play.music = await musicRepository.findOneOrFail(musicId);
    }
    if (roomId) {
      play.room = await roomRepository.findOneOrFail(roomId);
    }
    play.accuracy = calcAccuracy(answer, play.music.name);

    // Verifica se acertou
    if (play.accuracy === 100.0) {
      const { maxPodium } = await manager.query(
        'SELECT MAX(R.id) AS maxPodium FROM podium R',
      );
      const { currentPodium } = await manager.query(
        `
          SELECT COALESCE(MAX(P.podium_id), 0) + 1 AS currentPodium
          FROM play P
              JOIN room R ON R.id = P.roomId
          WHERE P.musicId = $1
              AND P.roomId = $2
              AND P.createdAt > R.startedAt
          `,
        [play.music.id, play.room.id],
      );
      play.podium = await manager.findOneOrFail(
        Podium,
        Math.min(maxPodium, currentPodium),
      );
    }
    const data = await playRepository.save(play);
    // Reset podium
    const { win } = await playRepository.query(
      `
          SELECT COALESCE(SUM(R.score), 0) >= 120 AS win
            FROM play P
                JOIN podium R ON R.id = P.podiumId
                JOIN room R1 ON R1.id = P.roomId AND R1.startedAt < P.createdAt
            WHERE P.userId = $1 AND P.roomId = $2;
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

    const socket = req.app.get('socket') as Socket;
    if (socket) socket.to(`${data.room.id}`).emit('plays');

    return res.status(200).json({ data });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const playRepository = getRepository(Play);
    const play = await playRepository.findOneOrFail(id);
    await playRepository.remove(play);

    const socket = req.app.get('socket') as Socket;
    if (socket) socket.to(`${play.room.id}`).emit('plays');

    return res.status(200).json({ data: true });
  }
}

function calcAccuracy(a: string, b: string) {
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
