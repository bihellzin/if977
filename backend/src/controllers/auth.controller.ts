import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { asyncHandler } from '../middlewares/errorHandler';
import { JwtAuth } from '../middlewares/passport';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';

export class AuthController {
  public router = Router();
  public path = '/auth';

  constructor() {
    this.router.post(`${this.path}`, asyncHandler(this.signup));
    this.router.get(`${this.path}`, JwtAuth, asyncHandler(this.currentUser));
  }

  async signup(req: Request, res: Response) {
    const { nickname, avatar } = req.body;

    const userRepository = getRepository(User);

    const user = userRepository.create({ nickname, avatar });
    const data = await userRepository.save(user);
    const token = jwt.sign(
      { sub: data.id },
      process.env.JWT_SECRET || 'secret',
      {
        algorithm: 'HS256',
        expiresIn: '1d',
      },
    );

    return res.status(201).json({ data, token });
  }

  async currentUser(req: Request, res: Response) {
    const data = req.user as User;
    return res.status(200).json({ data });
  }
}
