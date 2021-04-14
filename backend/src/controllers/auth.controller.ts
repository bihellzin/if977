import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import HttpException, { asyncHandler } from '../middlewares/errorHandler';
import { JwtAuth, LocalAuth } from '../middlewares/passport';
import { User } from '../models/user.model';

export class AuthController {
  public router = Router();
  public path = '/auth';

  constructor() {
    this.router.post(
      `${this.path}/signin`,
      LocalAuth,
      asyncHandler(this.signin),
    );
    this.router.post(`${this.path}/signup`, asyncHandler(this.signup));
    this.router.get(`${this.path}`, JwtAuth, asyncHandler(this.currentUser));
  }

  async signup(req: Request, res: Response) {
    const userRepository = getRepository(User);
    const { email } = req.body;

    const emailInUse = await userRepository.findOne({ where: { email } });
    if (emailInUse) {
      throw new HttpException(400, {
        email: 'Email address is already in use!',
      });
    }

    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.userType = 1;

    const data = await userRepository.save(user);
    const token = user.genToken();
    return res.status(201).json({ data, token });
  }

  async signin(req: Request, res: Response) {
    const user = req.user as User;
    const token = user.genToken();
    return res.status(200).json({ data: user, token });
  }

  async currentUser(req: Request, res: Response) {
    return res.status(200).json({ data: req.user });
  }
}
