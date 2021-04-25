import supertest, { Test } from 'supertest';
import typeorm from 'typeorm';
import faker from 'faker';
import express from 'express';
import App from '../app';
import Database from '../databases';
import { RoomController } from './room.controller';
import { AuthController } from './auth.controller';
import { GenreController } from './genre.controller';
import { MusicController } from './music.controller';

let connection: typeorm.Connection;
let app: express.Application;
let req: supertest.SuperTest<supertest.Test>;
let token: string;
let genreRepository: any;

describe('Room Suite', () => {
  beforeAll(async () => {
    connection = await Database.createConnection();
    app = new App([
      new RoomController(),
      new AuthController(),
      new GenreController(),
      new MusicController(),
    ]).app;

    req = supertest(app);

    let resultAuth = await req
      .post('/auth')
      .send({ nickname: 'Gabriel' })
      .expect(201);

    token = resultAuth.body.token;
  });

  it('Create with music and genre', async () => {
    const resAuth = await req
      .post('/genre')
      .send({ name: 'Rap' })
      .set('Authorization', `Bearer ${token}`);
    expect(resAuth.status).toEqual(201);
    expect(resAuth.body).toBeTruthy();

    const resMusic = await req
      .post('/music')
      .send({
        name: 'Demorô',
        author: 'Criolo',
        url: 'criolo-demoro.mp3',
        genreId: resAuth.body.data.id,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(resMusic.status).toEqual(201);
    expect(resMusic.body).toBeTruthy();

    const resRoom = await req
      .post('/room')
      .send({ genreId: resAuth.body.data.id, musicId: resMusic.body.data.id })
      .set('Authorization', `Bearer ${token}`);

    expect(resRoom.status).toEqual(201);
    expect(resRoom.body).toBeTruthy();

  });

  it('Create with genre', async () => {
    const resAuth = await req
      .post('/genre')
      .send({ name: 'Brega' })
      .set('Authorization', `Bearer ${token}`);
    expect(resAuth.status).toEqual(201);
    expect(resAuth.body).toBeTruthy();

    const resRoom = await req
      .post('/room')
      .send({ genreId: resAuth.body.data.id })
      .set('Authorization', `Bearer ${token}`);

    expect(resRoom.status).toEqual(201);
    expect(resRoom.body).toBeTruthy();
  });

  it('Find One', async () => {
    const resAuth = await req
      .post('/genre')
      .send({ name: 'Rosque' })
      .set('Authorization', `Bearer ${token}`);
    expect(resAuth.status).toEqual(201);
    expect(resAuth.body).toBeTruthy();

    const resMusic = await req
      .post('/music')
      .send({
        name: 'Misery Business',
        author: 'Paramore',
        url: 'paramore-misery-business.mp3',
        genreId: resAuth.body.data.id,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(resMusic.status).toEqual(201);
    expect(resMusic.body).toBeTruthy();

    const resRoom = await req
      .post('/room')
      .send({ genreId: resAuth.body.data.id, musicId: resMusic.body.data.id })
      .set('Authorization', `Bearer ${token}`);
    expect(resRoom.status).toEqual(201);
    expect(resRoom.body).toBeTruthy();

    const resFind = await req
      .get(`/room/${resRoom.body.data.id}`)
      .send()
      .set('Authorization', `Bearer ${token}`);
    expect(resFind.status).toEqual(200);
    expect(resFind.body).toBeTruthy();

  })

  it('Update', async() => {

    const resGenre = await req.post('/genre').send({ name: "Rosque" })
    .set('Authorization', `Bearer ${token}`);

    expect(resGenre.status).toEqual(201);
    expect(resGenre.body).toBeTruthy();

    const resGenre2 = await req
      .post('/genre')
      .send({ name: 'Punk' })
      .set('Authorization', `Bearer ${token}`);
    expect(resGenre.status).toEqual(201);
    expect(resGenre.body).toBeTruthy();

    const resMusic = await req
      .post('/music')
      .send({
        name: 'Misery Business',
        author: 'Paramore',
        url: 'paramore-misery-business.mp3',
        genreId: resGenre.body.data.id,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(resMusic.status).toEqual(201);
    expect(resMusic.body).toBeTruthy();

    const resRoom = await req
      .post('/room')
      .send({ genreId: resGenre.body.data.id, musicId: resMusic.body.data.id })
      .set('Authorization', `Bearer ${token}`);
    expect(resRoom.status).toEqual(201);
    expect(resRoom.body).toBeTruthy();

    const resRoomUpdate = await req
      .patch(`/room/${resRoom.body.data.id}`)
      .send({ genreId: resGenre2.body.data.id, musicId: resMusic.body.data.id })
      .set('Authorization', `Bearer ${token}`);
    expect(resRoom.status).toEqual(201);
    expect(resRoom.body).toBeTruthy();
  });

  it('Delete', async () => {
    const resGenre = await req
      .post('/genre')
      .send({ name: 'Forró' })
      .set('Authorization', `Bearer ${token}`);
    expect(resGenre.status).toEqual(201);
    expect(resGenre.body).toBeTruthy();

    const resMusic = await req
      .post('/music')
      .send({
        name: 'Um novo amor',
        author: 'Calcinha Preta',
        url: 'calcinha-preta-um-novo-amor.mp3',
        genreId: resGenre.body.data.id,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(resMusic.status).toEqual(201);
    expect(resMusic.body).toBeTruthy();

    const resRoom = await req
      .post('/room')
      .send({ genreId: resGenre.body.data.id, musicId: resMusic.body.data.id })
      .set('Authorization', `Bearer ${token}`);
    expect(resRoom.status).toEqual(201);
    expect(resRoom.body).toBeTruthy();

    const resRoomDelete = await req
      .delete(`/room/${resRoom.body.data.id}`)
      .send()
      .set('Authorization', `Bearer ${token}`);
    expect(resRoomDelete.status).toEqual(200);
    expect(resRoomDelete.body).toBeTruthy();
  });

  it('Find All', async () => {
    const resGenre = await req
      .post('/genre')
      .send({ name: 'Rosque' })
      .set('Authorization', `Bearer ${token}`);
    expect(resGenre.status).toEqual(201);
    expect(resGenre.body).toBeTruthy();



//    it('Find All', async() => {

    //     const resGenre = await req.post('/genre').send({ name: "Rosque" })
    //     .set('Authorization', `Bearer ${token}`);
    //     expect(resGenre.status).toEqual(201);
    //     expect(resGenre.body).toBeTruthy();
    
    //     const resGenre2 = await req.post('/genre').send({ name: "Punk" })
    //     .set('Authorization', `Bearer ${token}`);
    //     expect(resGenre.status).toEqual(201);
    //     expect(resGenre.body).toBeTruthy();
    
    //     const resMusic = await req.post('/music').send({ name: "Misery Business", author: "Paramore", url: "paramore-misery-business.mp3", genreId: resGenre.body.data.id })
    //     .set('Authorization', `Bearer ${token}`);
    
    //     expect(resMusic.status).toEqual(201);
    //     expect(resMusic.body).toBeTruthy();
    
    //     const resRoom = await req.post('/room').send({ genreId:resGenre.body.data.id , musicId: resMusic.body.data.id })
    //     .set('Authorization', `Bearer ${token}`);
    //     expect(resRoom.status).toEqual(201);
    //     expect(resRoom.body).toBeTruthy();
    
    //     const resRoom2 = await req.post('/room').send({ genreId:resGenre2.body.data.id })
    //     .set('Authorization', `Bearer ${token}`);
    //     expect(resRoom.status).toEqual(201);
    //     expect(resRoom.body).toBeTruthy();
    
    //     const resFindAll = await req.get('/room/').send()
    //     .set('Authorization', `Bearer ${token}`);
    //     expect(resFindAll.status).toEqual(200);
    //     expect(resFindAll.body).not.toBeTruthy();
    
    
    
    //   })

    const resMusic = await req
      .post('/music')
      .send({
        name: 'Misery Business',
        author: 'Paramore',
        url: 'paramore-misery-business.mp3',
        genreId: resGenre.body.data.id,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(resMusic.status).toEqual(201);
    expect(resMusic.body).toBeTruthy();

    const resRoom = await req
      .post('/room')
      .send({ genreId: resGenre.body.data.id, musicId: resMusic.body.data.id })
      .set('Authorization', `Bearer ${token}`);
    expect(resRoom.status).toEqual(201);
    expect(resRoom.body).toBeTruthy();

    const resRoom2 = await req
      .post('/room')
      .send({ genreId: resGenre2.body.data.id })
      .set('Authorization', `Bearer ${token}`);
    expect(resRoom.status).toEqual(201);
    expect(resRoom.body).toBeTruthy();

    const resFindAll = await req
      .get('/room/')
      .send()
      .set('Authorization', `Bearer ${token}`);
    expect(resFindAll.status).toEqual(200);
    expect(resFindAll.body).toBeTruthy();
  });
});
