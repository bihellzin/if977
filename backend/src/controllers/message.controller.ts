import { Request, Response, Router } from 'express';
import { Socket } from 'socket.io';
import { getRepository } from 'typeorm';
import { asyncHandler } from '../middlewares/errorHandler';
import { JwtAuth } from '../middlewares/passport';
import { Message } from '../models/message.model';
import { Room } from '../models/room.model';
import { User } from '../models/user.model';

export class MessageController {
  public router = Router();
  public path = '/message';

  constructor() {
    this.router.get(this.path, JwtAuth, asyncHandler(this.findAll));
    this.router.get(`${this.path}/:id`, JwtAuth, asyncHandler(this.findOne));
    this.router.post(this.path, JwtAuth, asyncHandler(this.create));
    // this.router.patch(`${this.path}/:id`, JwtAuth, asyncHandler(this.update));
    // this.router.delete(`${this.path}/:id`, JwtAuth, asyncHandler(this.delete));
  }

  async findAll(req: Request, res: Response) {
    const roomId = parseInt((req.query.roomId as string) || '0');
    const offset = parseInt((req.query.offset as string) || '0');
    const limit = Math.min(parseInt((req.query.limit as string) || '5'), 25);

    const messageRepository = getRepository(Message);
    const [data, total] = await messageRepository.findAndCount({
      where: { room: { id: roomId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });

    return res.status(200).json({ total, offset, limit, data: data.reverse() });
  }

  async findOne(req: Request, res: Response) {
    const { id } = req.params;

    const messageRepository = getRepository(Message);
    const message = await messageRepository.findOneOrFail(id);

    return res.status(200).json({ data: message });
  }

  async create(req: Request, res: Response) {
    const { content, roomId } = req.body;
    const user = req.user as User;

    const messageRepository = getRepository(Message);
    const roomRepository = getRepository(Room);

    const message = messageRepository.create();
    message.content = content;
    message.user = user;
    message.room = await roomRepository.findOneOrFail(roomId);
    const data = await messageRepository.save(message);

    const socket = req.app.get('socket') as Socket;
    if (socket) socket.to(`${message.room.id}`).emit('messages');

    return res.status(201).json({ data });
  }
}
