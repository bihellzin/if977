import { Request, Response, Router } from 'express';
import { getRepository, getManager, LessThan, Between } from 'typeorm';
import levenshtein from 'js-levenshtein';
import { asyncHandler } from '../middlewares/errorHandler';
import { JwtAuth } from '../middlewares/passport';
import { Play } from '../models/play.model';
import { Room } from '../models/room.model';
import { Music } from './../models/music.model';
import { Podium } from './../models/podium.model';
import { User } from '../models/user.model';
import { Socket } from 'socket.io';
import HttpException from './../middlewares/errorHandler';

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
      const flood = await playRepository.findOne({
        where: {
          room: { id: play.room.id },
          music: { id: play.music.id },
          user: { id: play.user.id },
          accuracy: play.accuracy,
          createdAt: Between(
            new Date(new Date().getTime() - 30 * 1000),
            new Date(),
          ),
        },
      });
      if (flood) throw new HttpException(500, 'Flood answer');
      console.log(`User ${user.id} hit music on Room ${roomId}`);
      const { maxPodium } = await manager
        .createQueryBuilder()
        .select('MAX(podium.id)', 'maxPodium')
        .from(Podium, 'podium')
        .getRawOne();
      const { currentPodium } = await manager
        .createQueryBuilder()
        .select('COALESCE(MAX(play.podiumId), 0) + 1', 'currentPodium')
        .from(Play, 'play')
        .innerJoin(Podium, 'podium', 'podium.id = play.podiumId')
        .innerJoin(
          Room,
          'room',
          'room.id = play.roomId AND play.createdAt > room.startedAt',
        )
        .where('play.musicId = :musicId', { musicId: play.music.id })
        .andWhere('play.roomId = :roomId', { roomId: play.room.id })
        .getRawOne();
      play.podium = await manager.findOneOrFail(
        Podium,
        Math.min(maxPodium, currentPodium),
      );
    }
    const data = await playRepository.save(play);
    // Reset podium
    if (play.accuracy === 100) {
      const { win } = await manager
        .createQueryBuilder()
        .select('COALESCE(SUM(podium.score), 0) >= 120', 'win')
        .from(Play, 'play')
        .innerJoin(Podium, 'podium', 'podium.id = play.podiumId')
        .innerJoin(
          Room,
          'room',
          'room.id = play.roomId AND room.startedAt < play.createdAt',
        )
        .where('play.userId = :userId', { userId: play.user.id })
        .andWhere('play.roomId = :roomId', { roomId: play.room.id })
        .getRawOne();
      if (win) {
        const resultDelete = await manager
          .createQueryBuilder()
          .delete()
          .from(Play)
          .where('roomId = :roomId', { roomId: play.room.id })
          .andWhere('userId != :userId', { userId: play.user.id })
          .andWhere('podiumId IS NOT NULL')
          .andWhere('createdAt <= :createdAt', { createdAt: data.createdAt })
          .execute();
        console.log('Delete play another players:' + resultDelete.affected);
        const resultUpdate = await manager
          .createQueryBuilder()
          .update(Room)
          .set({ startedAt: data.createdAt })
          .where('id = :roomId', { roomId: play.room.id })
          .execute();
        console.log('Update room' + resultUpdate.affected);
      }
    }

    const socket = req.app.get('socket') as Socket;
    if (socket) socket.to(`${play.room.id}`).emit('plays');

    return res.status(201).json({ data });
  }

  async update(req: Request, res: Response) {}

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
  return Math.round(((maxlength - diff) / maxlength) * 100);
}
