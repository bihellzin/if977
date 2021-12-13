import { Request, Response, Router } from 'express';
import { Socket } from 'socket.io';
import { getRepository } from 'typeorm';
import { asyncHandler } from '../middlewares/errorHandler';
import { JwtAuth } from '../middlewares/passport';
import { Music } from '../models/music.model';
import { Room } from '../models/room.model';
import { User } from '../models/user.model';

export class UserController {
  public router = Router();
  public path = '/user';

  constructor() {
    this.router.get(this.path, JwtAuth, asyncHandler(this.findAll));
    this.router.get(`${this.path}/:id`, JwtAuth, asyncHandler(this.findOne));
    this.router.post(this.path, JwtAuth, asyncHandler(this.create));
    this.router.patch(`${this.path}/:id`, JwtAuth, asyncHandler(this.update));
    this.router.delete(`${this.path}/:id`, JwtAuth, asyncHandler(this.delete));
  }

  async findAll(req: Request, res: Response) {
    const roomId = parseInt((req.query.roomId as string) || '0') || null;
    const offset = parseInt((req.query.offset as string) || '0');
    const limit = Math.min(parseInt((req.query.limit as string) || '5'), 25);

    const userRepository = getRepository(User);
    const [data, total] = await userRepository.findAndCount({
      where: {
        ...(req.query.roomId
          ? {
              room: {
                id: roomId,
              },
            }
          : {}),
      },
      skip: offset,
      take: limit,
    });

    return res.status(200).json({ total, offset, limit, data });
  }

  async findOne(req: Request, res: Response) {
    const { id } = req.params;

    const userRepository = getRepository(User);
    const user = await userRepository.findOneOrFail(id);

    return res.status(200).json({ data: user });
  }

  async create(req: Request, res: Response) {
    const { nickname, avatar, roomId } = req.body;

    const userRepository = getRepository(User);
    const roomRepository = getRepository(Room);

    const user = userRepository.create({ nickname, avatar });
    if (roomId) {
      user.room = await roomRepository.findOneOrFail(roomId);
    }
    const data = await userRepository.save(user);

    return res.status(201).json({ data });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nickname, avatar, roomId } = req.body;
    const socket = req.app.get('socket') as Socket;

    const userRepository = getRepository(User);
    const roomRepository = getRepository(Room);
    const musicRepository = getRepository(Music);

    const user = await userRepository.findOneOrFail(id, {
      relations: ['room'],
    });
    user.nickname = nickname || user.nickname;
    user.avatar = avatar || user.avatar;
    const oldRoom = user.room;
    if (roomId) {
      const room = await roomRepository.findOneOrFail(roomId);
      user.room = room;
      if (socket) socket.to(`${roomId}`).emit('join-room');
    } else {
      user.room = null as any;
    }
    const data = await userRepository.save(user);

    //Remove a sala anterior se ela estiver vazia
    if (roomId === null && oldRoom) {
      const totalPlayers = await userRepository
        .createQueryBuilder('user')
        .where('user.roomId = :roomId', { roomId: oldRoom.id })
        .getCount();
      if (totalPlayers === 0) {
        await roomRepository.remove(oldRoom);
      } else if (totalPlayers < 2 && oldRoom.music !== null) {
        oldRoom.music = null as any;
        await roomRepository.save(oldRoom);
        if (socket) socket.to(`${roomId}`).emit('join-room');
      }
    }

    // Inicia a música
    if (user.room && user.room.music === null) {
      const totalPlayers = await userRepository
        .createQueryBuilder('user')
        .where('user.roomId = :roomId', { roomId })
        .getCount();
      if (totalPlayers === 2) {
        const timer = setInterval(async () => {
          console.log(`Room ${roomId} waiting new music...`);
          const room = await roomRepository.findOneOrFail(roomId);
          room.music = null as any;
          await roomRepository.save(room);
          if (socket) socket.to(`${roomId}`).emit('join-room');
          setTimeout(async () => {
            const totalPlayers = await userRepository
              .createQueryBuilder('user')
              .where('user.roomId = :roomId', { roomId })
              .getCount();
            if (totalPlayers < 2) {
              console.log(`Room ${roomId} waiting more players...`);
              clearInterval(timer);
            } else {
              const room = await roomRepository.findOneOrFail(roomId);
              const musics = await musicRepository.find({
                where: { genre: { id: room.genre.id } },
              });
              if (musics.length) {
                room.music = musics[Math.floor(Math.random() * musics.length)];
                await roomRepository.save(room);
                console.log(
                  `Room ${roomId} playing ${room.music.name} - ${room.music.author}`,
                );
                if (socket) socket.to(`${roomId}`).emit('join-room');
              }
            }
          }, 5 * 1000);
        }, 30 * 1000);
      }
    }

    return res.status(200).json({ data });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const userRepository = getRepository(User);
    const user = await userRepository.findOneOrFail(id);
    await userRepository.remove(user);

    return res.status(200).json({ data: true });
  }
}
