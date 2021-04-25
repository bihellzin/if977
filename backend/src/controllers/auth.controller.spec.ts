import supertest from 'supertest';
import typeorm from 'typeorm';
import express from 'express';
import App from '../app';
import Database from '../databases';
import { AuthController } from './auth.controller';

let connection: typeorm.Connection;
let app: express.Application;
let req: supertest.SuperTest<supertest.Test>;

describe('Auth Suite', () => {
  beforeAll(async () => {
    connection = await Database.createConnection();
    app = new App([new AuthController()]).app;
    req = supertest(app);
  });

  it('Signup', async () => {
    const res = await req.post('/auth').send({ nickname: 'Gabriel' });

    expect(res.status).toEqual(201);
    expect(res.body.token).not.toBeUndefined();
  });

  it('Signin', async () => {
    const result = await req
      .post('/auth')
      .send({ nickname: 'Gabriel' })
      .expect(201);

    const res = await req
      .get('/auth')
      .set('Authorization', `Bearer ${result.body.token}`);

    expect(res.status).toEqual(200);
    expect(res.body.data).toMatchObject(result.body.data);
  });

  it('Signin invalid token', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const res = await req.get('/auth').set('Authorization', `Bearer ${token}`);

    expect(res.status).toEqual(401);
  });

  it('Signin without token', async () => {
    const res = await req.get('/auth');

    expect(res.status).toEqual(401);
  });
});
