import supertest, { Test } from 'supertest';
import typeorm from 'typeorm';
import faker from 'faker';
import express from 'express';
import App from '../app';
import Database from '../databases';
import { UserController } from './user.controller';
import { AuthController } from './auth.controller';
import { GenreController } from './genre.controller';


let connection: typeorm.Connection;
let app: express.Application;
<<<<<<< HEAD
=======
let appAuth: express.Application;
>>>>>>> 6ab6d3dce8fd57e9ae0b65ad7a8bbcd1ff722435
let req: supertest.SuperTest<supertest.Test>;
let token: string;
describe('User Suite', () => {
  beforeAll(async () => {
    connection = await Database.createConnection();
    app = new App([new UserController(), new AuthController(), new GenreController()]).app;

    req = supertest(app);

    let resultAuth = await req
      .post('/auth')
      .send({ 
          nickname: 'Gabriel' 
        })
      .expect(201);

    token = resultAuth.body.token;
  });

  it('Create genre', async () => {

    const resGenre = await req
      .post('/genre')
      .send({
           name: 'Rap'
        })
      .set('Authorization', `Bearer ${token}`);
    expect(resGenre.status).toEqual(201);
    expect(resGenre.body).toBeTruthy();

    });

  it('Find One genre', async () => {

    const resGenre = await req
      .post('/genre')
      .send({ 
          name: 'DETONA DJ VAL' 
        })
      .set('Authorization', `Bearer ${token}`);
    expect(resGenre.status).toEqual(201);
    expect(resGenre.body).toBeTruthy();

    const resfind = await req
      .get(`/genre/${resGenre.body.data.id}`)
      .send()
      .set('Authorization', `Bearer ${token}`);
    expect(resfind.status).toEqual(200);
    expect(resfind.body).toBeTruthy();
  });

  it('Find All genres', async () => {

    const resGenre = await req
      .post('/genre')
      .send({ 
          name: 'TROIA É O MAIOR' 
        })
      .set('Authorization', `Bearer ${token}`);
    expect(resGenre.status).toEqual(201);
    expect(resGenre.body).toBeTruthy();

    const resGenre2 = await req
      .post('/genre')
      .send({ 
          name: 'TURUGUDUGUDUGUDU' 
        })
      .set('Authorization', `Bearer ${token}`);
    expect(resGenre2.status).toEqual(201);
    expect(resGenre2.body).toBeTruthy();

    const res = await req
      .get('/genre')
      .send()
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(res.body.data).not.toEqual([]);
    });

  it('Update genre', async () => {

    const resGenre = await req
      .post('/genre')
      .send({ 
          name: 'TROIA É MARILIA 13' 
        })
      .set('Authorization', `Bearer ${token}`);
    expect(resGenre.status).toEqual(201);
    expect(resGenre.body).toBeTruthy();

    const res = await req
      .patch(`/genre/${resGenre.body.data.id}`)
      .send({ 
          name: 'MARILIA É TROIA 13'
        })
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.data).toMatchObject({
        name: 'MARILIA É TROIA 13'
    });
    expect(res.status).toEqual(200);
  });

  it('Delete genre', async () => {

    const resGenre = await req
      .post('/genre')
      .send({ 
          name: 'Carnaval' 
        })
      .set('Authorization', `Bearer ${token}`);
    expect(resGenre.status).toEqual(201);
    expect(resGenre.body).toBeTruthy();

    const resDelete = await req
      .delete(`/genre/${resGenre.body.data.id}`)
      .send()
      .set('Authorization', `Bearer ${token}`);
    expect(resDelete.status).toEqual(200);

    const resFindOne = await req
    .get(`/genre/${resGenre.body.data.id}`)
    .send()
    .set('Authorization', `Bearer ${token}`);
  expect(resFindOne.status).toEqual(404);
  expect(resFindOne.body.error).toBeTruthy();

  });

});
