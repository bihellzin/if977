import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import HttpException, { asyncHandler } from '../middlewares/errorHandler';
import { JwtAuth } from '../middlewares/passport';
import { Genre } from '../models/genre.model';

export class GenreController {
  public router = Router();
  public path = '/genre';

  constructor() {
    this.router.get(this.path, JwtAuth, asyncHandler(this.findAll));
    this.router.get(`${this.path}/:id`, JwtAuth, asyncHandler(this.findOne));
    this.router.post(this.path, JwtAuth, asyncHandler(this.create));
    this.router.patch(`${this.path}/:id`, JwtAuth, asyncHandler(this.update));
    this.router.delete(`${this.path}/:id`, JwtAuth, asyncHandler(this.delete));
  }

  async findAll(req: Request, res: Response) {
    const offset = parseInt((req.query.offset as string) || '0');
    const limit = Math.min(parseInt((req.query.limit as string) || '5'), 25);

    const genreRepository = getRepository(Genre);
    const [data, total] = await genreRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    return res.status(200).json({ total, offset, limit, data });
  }

  async findOne(req: Request, res: Response) {
    const { id } = req.params;

    const genreRepository = getRepository(Genre);
    const genre = await genreRepository.findOneOrFail(id);

    return res.status(200).json({ data: genre });
  }

  async create(req: Request, res: Response) {
    const { name } = req.body;

    const genreRepository = getRepository(Genre);

    const genre = genreRepository.create();
    genre.name = name;
    const data = await genreRepository.save(genre);

    return res.status(201).json({ data });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;

    const genreRepository = getRepository(Genre);

    const genre = await genreRepository.findOneOrFail(id);
    genre.name = name;
    const data = await genreRepository.save(genre);

    return res.status(200).json({ data });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const genreRepository = getRepository(Genre);
    const genre = await genreRepository.findOneOrFail(id);
    await genreRepository.remove(genre);

    return res.status(200).json({ data: true });
  }
}
