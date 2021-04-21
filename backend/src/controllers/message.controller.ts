import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import HttpException, { asyncHandler } from '../middlewares/errorHandler';
import { Message } from '../models/message.model';
import { Music } from '../models/music.model';
import { Room } from '../models/room.model';
import { User } from '../models/user.model';

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
    const messageRepository = getRepository(Message);
    const message = await messageRepository.findOne(req.params.id);
    if (!message) {
      throw new HttpException(404, 'Music not found!');
    }
    return res.status(200).json({ data: message });
  }

  async create(req: Request, res: Response) {
    const { content, roomId } = req.body;
    const messageRepository = getRepository(Message);
    const roomRepository = getRepository(Room);
    const message = messageRepository.create();
    message.content = content;
    message.user = req.user as User;
    if (!roomId) {
      const room = await roomRepository.findOne(roomId);
      if (!room) {
        throw new HttpException(404, 'Music not found!');
      }
      message.room = room;
    }
    const data = await messageRepository.save(message);
    return res.status(201).json({ data });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { roomId } = req.body;
    const roomRepository = getRepository(Room);
    const messageRepository = getRepository(Message);
    const message = await messageRepository.findOne(id);
    if (!message) {
      throw new HttpException(404, 'Music not found!');
    }
    message.user = req.user as User;
    if (!roomId) {
      const room = await roomRepository.findOne(roomId);
      if (!room) {
        throw new HttpException(404, 'Room not found!');
      }
      message.room = room;
    }
    const data = await messageRepository.save(message);
    return res.status(200).json({ data });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const messageRepository = getRepository(Message);
    const musicRepository = getRepository(Music);
    const music = await messageRepository.findOne(id);
    if (!music) {
      throw new HttpException(404, 'Music not found!');
    }
    const result = await musicRepository.findOne(id);
    return res.status(200).json({ data: Boolean(result) });
  }
}
