import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import HttpException, { asyncHandler } from '../middlewares/errorHandler';
import { User } from '../models/user.model';

export class UserController {
  public router = Router();
  public path = '/user';
  private userRepository = getRepository(User);

  constructor() {
    this.router.get(this.path, asyncHandler(this.findAll));
    this.router.get(`${this.path}/:id`, asyncHandler(this.findOne));
    this.router.post(this.path, asyncHandler(this.create));
    this.router.patch(`${this.path}/:id`, asyncHandler(this.update));
    this.router.delete(`${this.path}/:id`, asyncHandler(this.delete));
  }

  async findAll(req: Request, res: Response) {
    const offset = parseInt((req.query.offset as string) || '0');
    const limit = Math.max(parseInt((req.query.limit as string) || '5'), 25);
    const [data, total] = await this.userRepository.findAndCount({
      skip: offset,
      take: limit,
    });
    return res.status(200).json({ total, offset, limit, data });
  }

  async findOne(req: Request, res: Response) {
    const { id } = req.params;
    const data = await this.userRepository.findOne(id);
    return res.status(200).json({ data });
  }

  async create(req: Request, res: Response) {
    const { nickname, avatar } = req.body;
    const user = this.userRepository.create({ nickname, avatar });
    const data = await this.userRepository.save(user);
    return res.status(201).json({ data });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nickname, avatar } = req.body;
    const data = await this.userRepository.findOne(id);
    if (!data) {
      throw new HttpException(404, 'Resource not found!');
    }
    data.nickname = nickname;
    data.avatar = avatar;
    await this.userRepository.save(data);
    return res.status(200).json({ data: true });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const data = await this.userRepository.findOne(id);
    if (!data) {
      throw new HttpException(404, 'Resource not found!');
    }
    await data.remove();
    const result = await this.userRepository.findOne(id);
    return res.status(200).json({ data: Boolean(result) });
  }
}
