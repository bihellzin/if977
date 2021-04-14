import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { asyncHandler } from '../middlewares/errorHandler';
import { Match } from '../models/match.model';

export class MatchController {
  public router = Router();
  public path = '/match';

  constructor() {
    this.router.get(this.path, asyncHandler(this.findAll));
    this.router.get(`${this.path}/:id`, asyncHandler(this.findOne));
    this.router.post(this.path, asyncHandler(this.create));
    this.router.put(`${this.path}/:id`, asyncHandler(this.update));
    this.router.delete(`${this.path}/:id`, asyncHandler(this.delete));
  }

  async findAll(req: Request, res: Response) {
    const { offset, limit } = req.query;
    const matchRepository = getRepository(Match);
    const data = await matchRepository.find({
      skip: parseInt((offset as string) || '0', 10),
      take: Math.max(parseInt((limit as string) || '5', 10), 25),
    });
    return res.status(200).json({ data });
  }

  async findOne(req: Request, res: Response) {
    const matchRepository = getRepository(Match);
    const data = await matchRepository.findOne(req.params.id);
    return res.status(200).json({ data });
  }

  async create(req: Request, res: Response) {
    const matchRepository = getRepository(Match);
    const match = matchRepository.create(req.body);
    const data = await matchRepository.save(match);
    return res.status(201).json({ data });
  }

  async update(req: Request, res: Response) {
    const matchRepository = getRepository(Match);
    const data = await matchRepository.update(req.params.id, req.body);
    return res.status(200).json({ data: Boolean(data.affected) });
  }

  async delete(req: Request, res: Response) {
    const matchRepository = getRepository(Match);
    const data = await matchRepository.delete(req.params.id);
    return res.status(200).json({ data: Boolean(data.affected) });
  }
}