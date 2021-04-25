import supertest, { Test } from 'supertest';
import typeorm from 'typeorm';
import faker from 'faker';
import express from 'express';
import App from '../app';
import Database from '../databases';
import { AuthController } from './auth.controller';
import { GenreController } from './genre.controller';
import { RoomController } from './room.controller';
import { UserController} from './user.controller';
import { MessageController} from './message.controller';


let connection: typeorm.Connection;
let app: express.Application;
let req: supertest.SuperTest<supertest.Test>;
let token: string;
describe('User Suite', () => {
  beforeAll(async () => {
    connection = await Database.createConnection();
    app = new App([new AuthController(), new GenreController(), new RoomController(), new UserController(), new MessageController()]).app;

    req = supertest(app);

    let resultAuth = await req
    .post('/auth')
    .send({ nickname: 'Gabriel' })
    .expect(201);

    token = resultAuth.body.token;

  });

  it('Create Message', async () => {

    const res = await req
      .post('/user')
      .send({ nickname: 'Gabriel', avatar: 'avatar.path.gabriel' })
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(201);
    expect(res.body).toBeTruthy();

    const resGenre = await req
      .post('/genre')
      .send({ name: 'Brega' })
      .set('Authorization', `Bearer ${token}`);
    expect(resGenre.status).toEqual(201);
    expect(resGenre.body).toBeTruthy();

    const resRoom = await req
      .post('/room')
      .send({ genreId: resGenre.body.data.id })
      .set('Authorization', `Bearer ${token}`);
    expect(resRoom.status).toEqual(201);
    expect(resRoom.body).toBeTruthy();

    const resMessage = await req
    .post('/message')
    .send({ 
    content: "DALE RAPAZIADA TO ONLINE",
    roomId: resRoom.body.data.id })
    .set('Authorization', `Bearer ${token}`);
    expect(resMessage.status).toEqual(201);
    expect(resMessage.body).toBeTruthy();
    expect(resMessage.body.data).not.toBeUndefined();

  });

  it('Find all messages from a room', async () => {

    const res = await req
      .post('/user')
      .send({ nickname: 'Julin', avatar: 'avatar.path.gabriel' })
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(201);
    expect(res.body).toBeTruthy();

    const resGenre = await req
      .post('/genre')
      .send({ name: 'hj é dia de rock bb' })
      .set('Authorization', `Bearer ${token}`);
    expect(resGenre.status).toEqual(201);
    expect(resGenre.body).toBeTruthy();

    const resRoom = await req
      .post('/room')
      .send({ genreId: resGenre.body.data.id })
      .set('Authorization', `Bearer ${token}`);
    expect(resRoom.status).toEqual(201);
    expect(resRoom.body).toBeTruthy();

    const resMessage = await req
    .post('/message')
    .send({ 
    content: "DALE RAPAZIADA TO ONLINE",
    roomId: resRoom.body.data.id 
    })
    .set('Authorization', `Bearer ${token}`);
    expect(resMessage.status).toEqual(201);
    expect(resMessage.body).toBeTruthy();
    expect(resMessage.body.data).not.toBeUndefined();
    
    const resMessage2 = await req
    .post('/message')
    .send({ 
    content: "CALA A BOCA E JOGA",
    roomId: resRoom.body.data.id 
    })
    .set('Authorization', `Bearer ${token}`);
    expect(resMessage2.status).toEqual(201);
    expect(resMessage2.body).toBeTruthy();
    expect(resMessage2.body.data).not.toBeUndefined();
    const resMessageFindAll = await req
    .get(`/message?roomId=${resRoom.body.data.id}`)
    .send()
    .set('Authorization', `Bearer ${token}`);
    expect(resMessageFindAll.status).toEqual(200);
    expect(resMessageFindAll.body).toBeTruthy();
    expect(resMessageFindAll.body.data).not.toBeUndefined();

  });

  it('Find One Message', async () => {

    const res = await req
      .post('/user')
      .send({ nickname: 'Jão', avatar: 'avatar.path.gabriel' })
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(201);
    expect(res.body).toBeTruthy();

    const resGenre = await req
      .post('/genre')
      .send({ name: 'pagodão raiz' })
      .set('Authorization', `Bearer ${token}`);
    expect(resGenre.status).toEqual(201);
    expect(resGenre.body).toBeTruthy();

    const resRoom = await req
      .post('/room')
      .send({ genreId: resGenre.body.data.id })
      .set('Authorization', `Bearer ${token}`);
    expect(resRoom.status).toEqual(201);
    expect(resRoom.body).toBeTruthy();

    const resMessage = await req
    .post('/message')
    .send({ 
    content: "HOJE É DIA DE PERICLES",
    roomId: resRoom.body.data.id 
    })
    .set('Authorization', `Bearer ${token}`);
    expect(resMessage.status).toEqual(201);
    expect(resMessage.body).toBeTruthy();
    expect(resMessage.body.data).not.toBeUndefined();
    
    const resMessage2 = await req
    .post('/message')
    .send({ 
    content: "CALA A BOCA IRMÃO PREFIRO FORRÓ",
    roomId: resRoom.body.data.id 
    })
    .set('Authorization', `Bearer ${token}`);
    expect(resMessage2.status).toEqual(201);
    expect(resMessage2.body).toBeTruthy();
    expect(resMessage2.body.data).not.toBeUndefined();


    const resMessageFindOne = await req
    .get(`/message/${resRoom.body.data.id}`)
    .send()
    .set('Authorization', `Bearer ${token}`);
    expect(resMessageFindOne.status).toEqual(200);
    expect(resMessageFindOne.body).toBeTruthy();
    expect(resMessageFindOne.body.data).not.toBeUndefined();

  });

})
