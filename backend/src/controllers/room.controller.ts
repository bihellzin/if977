import { Request, Response, Router } from 'express';
import { getManager, getRepository, ILike } from 'typeorm';
import HttpException, { asyncHandler } from '../middlewares/errorHandler';
import { JwtAuth } from '../middlewares/passport';
import { Genre } from '../models/genre.model';
import { Music } from '../models/music.model';
import { Room } from '../models/room.model';
import { User } from '../models/user.model';

export class RoomController {
  public router = Router();
  public path = '/room';

  constructor() {
    this.router.get(this.path, JwtAuth, asyncHandler(this.findAll));
    this.router.get(
      `${this.path}/:id`,
      JwtAuth,
      asyncHandler(this.findOneOrFail),
    );
    this.router.post(this.path, JwtAuth, asyncHandler(this.create));
    this.router.patch(`${this.path}/:id`, JwtAuth, asyncHandler(this.update));
    this.router.delete(`${this.path}/:id`, JwtAuth, asyncHandler(this.delete));
  }

  async findAll(req: Request, res: Response) {
    const { offset: skip, limit: take, query = '' } = req.query;
    const offset = parseInt((skip as string) || '0');
    const limit = Math.min(parseInt((take as string) || '5'), 25);

    const roomRepository = getRepository(Room);
    const [data, total] = await roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.owner', 'owner')
      .leftJoinAndSelect('room.genre', 'genre')
      .where('owner.nickname LIKE :query', { query: `%${query}%` })
      .orWhere('genre.name LIKE :query', { query: `%${query}%` })
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return res.status(200).json({ total, offset, limit, data });
  }

  async findOneOrFail(req: Request, res: Response) {
    const { id } = req.params;

    const roomRepository = getRepository(Room);
    const room = await roomRepository.findOneOrFail(id, {
      relations: ['genre', 'owner', 'music'],
    });

    return res.status(200).json({ data: room });
  }

  async create(req: Request, res: Response) {
    const { genreId, musicId } = req.body;
    const user = req.user as User;

    const userRepository = getRepository(User);
    const genreRepository = getRepository(Genre);
    const musicRepository = getRepository(Music);
    const roomRepository = getRepository(Room);

    const room = roomRepository.create();
    room.genre = await genreRepository.findOneOrFail(genreId);
    room.owner = user;
    if (musicId) {
      const music = await musicRepository.findOneOrFail(musicId);
      room.music = music;
    } else {
      room.music = null as any;
    }
    const data = await roomRepository.save(room);
    await userRepository.update(user.id, { room });

    return res.status(201).json({ data: data });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { genreId, musicId } = req.body;
    const user = req.user as User;

    const genreRepository = getRepository(Genre);
    const musicRepository = getRepository(Music);
    const roomRepository = getRepository(Room);

    const room = await roomRepository.findOneOrFail(id);
    room.owner = user;
    if (musicId) {
      room.music = await musicRepository.findOneOrFail(musicId);
    }
    if (genreId) {
      room.genre = await genreRepository.findOneOrFail(genreId);
    }

    const data = await roomRepository.save(room);
    return res.status(200).json({ data });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const roomRepository = getRepository(Room);
    const room = await roomRepository.findOneOrFail(id);
    await roomRepository.remove(room);

    return res.status(200).json({ data: true });
  }
}
