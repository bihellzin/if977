import App from '../app';
import supertest from 'supertest';
import express from 'express';
import { UserController } from './../controllers/user.controller';
import Database from '../databases';
import faker from 'faker';
import typeorm from 'typeorm';

let connection: typeorm.Connection;
let app: express.Application;
let req: supertest.SuperTest<supertest.Test>;

describe('User Suite', () => {
  beforeAll(async () => {
    connection = await Database.createConnection();
    app = new App([new UserController()]).app;
    req = supertest(app);
  });

  beforeEach(async () => {
    await connection.dropDatabase();
    await connection.runMigrations();
  });

  it('Empty fetch users', async () => {
    const res = await req.get('/user');
    expect(res.status).toEqual(200);
    expect(res.body.data).toEqual([]);
  });

  it('Create invalid ', async () => {
    const res = await req.post('/user');
    expect(res.status).toEqual(500);
    expect(res.body.data).toBeUndefined();
  });

  it('Create valid user', async () => {
    const user = { name: faker.internet.userName() };
    const res = await req.post('/user').send(user);
    expect(res.status).toEqual(201);
    expect(res.body.data).toMatchObject(user);
  });

  it('Fully fetch users', async () => {
    const user = { name: faker.internet.userName() };
    await req.post('/user').send(user).expect(201);
    const res = await req.get('/user');
    expect(res.status).toEqual(200);
    expect(res.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining(user)]),
    );
  });

  it('Fetch user', async () => {
    const user = { name: faker.internet.userName() };
    const { body } = await req.post('/user').send(user).expect(201);
    const res = await req.get(`/user/${body.data.id}`).expect(200);
    expect(res.body.data).toMatchObject(user);
  });

  it('Empty fetch user', async () => {
    const res = await req.get(`/user/${faker.random.uuid()}`);
    expect(res.status).toEqual(200);
    expect(res.body.data).toBeUndefined();
  });

  it('Update invalid user', async () => {
    const res = await req
      .patch(`/user/${faker.random.uuid()}`)
      .send({ name: faker.internet.userName() });
    expect(res.status).toEqual(200);
    expect(res.body.data).toBeFalsy();
  });

  it('Update users', async () => {
    const { body } = await req
      .post('/user')
      .send({ name: faker.internet.userName() })
      .expect(201);
    expect(body.data.id).toBeDefined();

    const res = await req
      .patch(`/user/${body.data.id}`)
      .send({ name: faker.internet.userName() });
    expect(res.status).toEqual(200);
    expect(res.body.data).toBeTruthy();
  });

  it('Delete invalid user', async () => {
    const res = await req.delete(`/user/${faker.random.uuid()}`);
    expect(res.status).toEqual(200);
    expect(res.body.data).toBeFalsy();
  });

  it('Delete users', async () => {
    const { body } = await req
      .post('/user')
      .send({ name: faker.internet.userName() })
      .expect(201);
    expect(body.data.id).toBeDefined();
    const res = await req.delete(`/user/${body.data.id}`);
    expect(res.status).toEqual(200);
    expect(res.body.data).toBeTruthy();
  });
});
