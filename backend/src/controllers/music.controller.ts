import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import HttpException, { asyncHandler } from '../middlewares/errorHandler';
import { JwtAuth } from '../middlewares/passport';
import { Genre } from '../models/genre.model';
import { Music } from '../models/music.model';

export class MusicController {
  public router = Router();
  public path = '/music';

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
    const musicRepository = getRepository(Music);
    const [data, total] = await musicRepository.findAndCount({
      skip: offset,
      take: limit,
    });
    return res.status(200).json({ total, offset, limit, data });
  }

  async findOne(req: Request, res: Response) {
    const musicRepository = getRepository(Music);
    const music = await musicRepository.findOne(req.params.id);
    if (!music) {
      throw new HttpException(404, 'Genre not found!');
    }
    return res.status(200).json({ data: music });
  }

  async create(req: Request, res: Response) {
    const { name, author, url, genreId } = req.body;
    const musicRepository = getRepository(Music);
    const genreRepository = getRepository(Genre);
    const music = musicRepository.create({ name, author, url });
    const genre = await genreRepository.findOne(genreId);
    if (!genre) {
      throw new HttpException(404, 'Genre not found!');
    }
    music.name = name;
    music.author = author;
    music.url = url;
    music.genre = genre;
    const data = await musicRepository.save(music);
    return res.status(201).json({ data });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, author, url, genreId } = req.body;
    const musicRepository = getRepository(Music);
    const genreRepository = getRepository(Genre);
    const music = await musicRepository.findOne(id);
    if (!music) {
      throw new HttpException(404, 'Music not found!');
    }
    const genre = await genreRepository.findOne(genreId);
    if (!genre) {
      throw new HttpException(404, 'Genre not found!');
    }
    music.name = name;
    music.author = author;
    music.url = url;
    music.genre = genre;
    const data = await musicRepository.save(music);
    return res.status(200).json({ data });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const musicRepository = getRepository(Music);
    const music = await musicRepository.findOne(id);
    if (!music) {
      throw new HttpException(404, 'Music not found!');
    }
    const result = await musicRepository.findOne(id);
    return res.status(200).json({ data: Boolean(result) });
  }
}
