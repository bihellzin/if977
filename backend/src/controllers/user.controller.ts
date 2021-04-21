import { Request, Response, Router } from 'express';
import { getRepository, Repository } from 'typeorm';
import HttpException, { asyncHandler } from '../middlewares/errorHandler';
import { JwtAuth } from '../middlewares/passport';
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
    const userRepository = getRepository(User);
    const offset = parseInt((req.query.offset as string) || '0');
    const limit = Math.max(parseInt((req.query.limit as string) || '5'), 25);
<<<<<<< HEAD
=======
    const userRepository = getRepository(User);
>>>>>>> f2809b69da0fda4031f3d4dd4f12ac911906ab39
    const [data, total] = await userRepository.findAndCount({
      skip: offset,
      take: limit,
    });
    return res.status(200).json({ total, offset, limit, data });
  }

  async findOne(req: Request, res: Response) {
    const userRepository = getRepository(User);
    const { id } = req.params;
<<<<<<< HEAD
=======
    const userRepository = getRepository(User);
>>>>>>> f2809b69da0fda4031f3d4dd4f12ac911906ab39
    const user = await userRepository.findOne(id);
    if (!user) {
      throw new HttpException(404, 'User not found!');
    }
    return res.status(200).json({ data: user });
  }

  async create(req: Request, res: Response) {
    const userRepository = getRepository(User);
    const roomRepository = getRepository(Room);

    const { nickname, avatar, roomId } = req.body;
<<<<<<< HEAD
=======
    const userRepository = getRepository(User);
    const roomRepository = getRepository(Room);
>>>>>>> f2809b69da0fda4031f3d4dd4f12ac911906ab39
    const user = userRepository.create({ nickname, avatar });
    if (roomId) {
      const room = await roomRepository.findOne(roomId);
      if (!room) {
        throw new HttpException(404, 'Room not found!');
      }
      user.room = room;
    } else {
      user.room = null as any;
    }
    const data = await userRepository.save(user);
    return res.status(201).json({ data });
  }

  async update(req: Request, res: Response) {
    const userRepository = getRepository(User);
    const roomRepository = getRepository(Room);
    const { id } = req.params;
    const { nickname, avatar, roomId } = req.body;
<<<<<<< HEAD
=======
    const userRepository = getRepository(User);
    const roomRepository = getRepository(Room);
>>>>>>> f2809b69da0fda4031f3d4dd4f12ac911906ab39
    const user = await userRepository.findOne(id);
    if (!user) {
      throw new HttpException(404, 'User not found!');
    }
    user.nickname = nickname;
    user.avatar = avatar;
    if (roomId) {
      const room = await roomRepository.findOne(roomId);
      if (!room) {
        throw new HttpException(404, 'Room not found!');
      }
      user.room = room;
    } else {
      user.room = null as any;
    }
    const data = await userRepository.save(user);
    return res.status(200).json({ data });
  }

  async delete(req: Request, res: Response) {
    const userRepository = getRepository(User);
    const { id } = req.params;
<<<<<<< HEAD
=======
    const userRepository = getRepository(User);
>>>>>>> f2809b69da0fda4031f3d4dd4f12ac911906ab39
    const user = await userRepository.findOne(id);
    if (!user) {
      throw new HttpException(404, 'User not found!');
    }
<<<<<<< HEAD
    const result = await userRepository.delete(id);
    if(!result){
      throw new HttpException(404, "User can't be deleted!")
    }
=======
    const result = await userRepository.findOne(id);
>>>>>>> f2809b69da0fda4031f3d4dd4f12ac911906ab39
    return res.status(200).json({ data: Boolean(result) });
  }
}
