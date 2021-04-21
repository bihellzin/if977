import { Request, Response, Router } from 'express';
import { getRepository, ILike } from 'typeorm';
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
    this.router.get(`${this.path}/:id`, JwtAuth, asyncHandler(this.findOne));
    this.router.post(this.path, JwtAuth, asyncHandler(this.create));
    this.router.patch(`${this.path}/:id`, JwtAuth, asyncHandler(this.update));
    this.router.delete(`${this.path}/:id`, JwtAuth, asyncHandler(this.delete));
  }

  async findAll(req: Request, res: Response) {
    const { query = '' } = req.body;
    const offset = parseInt((req.query.offset as string) || '0');
    const limit = Math.max(parseInt((req.query.limit as string) || '5'), 25);
    const roomRepository = getRepository(Room);
    const [data, total] = await roomRepository.findAndCount({
      where: {
        owner: {
          nickname: ILike(`%${query}%`),
        },
      },
      skip: offset,
      take: limit,
    });
    return res.status(200).json({ total, offset, limit, data });
  }

  async findOne(req: Request, res: Response) {
    const { id } = req.params;
    const roomRepository = getRepository(Room);
    const room = await roomRepository.findOne(id);
    if (!room) {
      throw new HttpException(404, 'Room not found!');
    }
    return res.status(200).json({ data: room });
  }

  async create(req: Request, res: Response) {
    const { genreId, musicId } = req.body;
    const genreRepository = getRepository(Genre);
    const musicRepository = getRepository(Music);
    const roomRepository = getRepository(Room);
    const genre = await genreRepository.findOne(genreId);
    if (!genre) {
      throw new HttpException(404, 'Genre not found!');
    }
    console.log(genre);
    const room = roomRepository.create();
    room.genre = genre;
    room.owner = req.user as User;
    if (musicId) {
      const music = await musicRepository.findOne(musicId);
      if (!music) {
        throw new HttpException(404, 'Music not found!');
      }
      room.music = music;
    } else {
      room.music = null as any;
    }
    const data = await roomRepository.save(room);
    return res.status(201).json({ data });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { genreId, musicId } = req.body;
    const genreRepository = getRepository(Genre);
    const musicRepository = getRepository(Music);
    const roomRepository = getRepository(Room);
    const genre = await genreRepository.findOne(genreId);
    if (!genre) {
      throw new HttpException(404, 'Genre not found!');
    }
    const room = await roomRepository.findOne(id);
    if (!room) {
      throw new HttpException(404, 'Room not found!');
    }
    room.genre = genre;
    room.owner = req.user as User;
    if (musicId) {
      const music = await musicRepository.findOne(id);
      if (!music) {
        throw new HttpException(404, 'Music not found!');
      }
      room.music = music;
    } else {
      room.music = null as any;
    }
    const data = await roomRepository.save(room);
    return res.status(200).json({ data });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const roomRepository = getRepository(Room);
    const room = await roomRepository.findOne(id);
    if (!room) {
      throw new HttpException(404, 'Room not found!');
    }
    const result = await roomRepository.findOne(id);
    return res.status(200).json({ data: Boolean(result) });
  }
}
