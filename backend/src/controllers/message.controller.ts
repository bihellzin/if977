import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { asyncHandler } from '../middlewares/errorHandler';
import { Message } from '../models/message.model';

export class MessageController {
  public router = Router();
  public path = '/message';

  constructor() {
    this.router.get(this.path, asyncHandler(this.findAll));
    this.router.get(`${this.path}/:id`, asyncHandler(this.findOne));
    this.router.post(this.path, asyncHandler(this.create));
    this.router.put(`${this.path}/:id`, asyncHandler(this.update));
    this.router.delete(`${this.path}/:id`, asyncHandler(this.delete));
  }

  async findAll(req: Request, res: Response) {
    const { offset, limit } = req.query;
    const messageRepository = getRepository(Message);
    const data = await messageRepository.find({
      skip: parseInt((offset as string) || '0', 10),
      take: Math.max(parseInt((limit as string) || '5', 10), 25),
    });
    return res.status(200).json({ data });
  }

  async findOne(req: Request, res: Response) {
    const messageRepository = getRepository(Message);
    const data = await messageRepository.findOne(req.params.id);
    return res.status(200).json({ data });
  }

  async create(req: Request, res: Response) {
    const messageRepository = getRepository(Message);
    const message = messageRepository.create(req.body);
    const data = await messageRepository.save(message);
    return res.status(201).json({ data });
  }

  async update(req: Request, res: Response) {
    const messageRepository = getRepository(Message);
    const data = await messageRepository.update(req.params.id, req.body);
    return res.status(200).json({ data: Boolean(data.affected) });
  }

  async delete(req: Request, res: Response) {
    const messageRepository = getRepository(Message);
    const data = await messageRepository.delete(req.params.id);
    return res.status(200).json({ data: Boolean(data.affected) });
  }
}
