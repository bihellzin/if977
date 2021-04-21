import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/user.model';
import HttpException from './errorHandler';
import { NextFunction } from 'express';

passport.use(
  'jwt',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'secret',
      algorithms: ['HS256'],
    },
    (payload, done) => {
      User.findOne(payload.sub)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(new HttpException(401, 'Token inválido!'));
        })
        .catch(error => {
          done(new HttpException(401, 'Token inválido!'));
        });
    },
  ),
);

passport.serializeUser(function (user, done) {
  done(null, (user as User).id);
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {
  User.findOne(id as number)
    .then(user => {
      done(null, user);
    })
    .catch(error => {
      done(error);
    });
});

const JwtAuth = (req: any, res: any, next: NextFunction) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: any, user: User, info: any) => {
      if (err) next(err);
      if (!user) throw new HttpException(401, 'Invalid Token!');
      req.user = user;
      next();
    },
  )(req, res, next);
};

export { passport, JwtAuth };
