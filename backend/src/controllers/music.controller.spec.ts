import supertest, { Test } from 'supertest';
import typeorm from 'typeorm';
import faker from 'faker';
import express from 'express';
import App from '../app';
import Database from '../databases';
import { AuthController } from './auth.controller';
import { GenreController } from './genre.controller';
import { MusicController } from './music.controller';

let connection: typeorm.Connection;
let app: express.Application;
let req: supertest.SuperTest<supertest.Test>;
let token: string;
describe('User Suite', () => {
  beforeAll(async () => {
    connection = await Database.createConnection();
    app = new App([new AuthController(), new GenreController(), new MusicController()]).app;

    req = supertest(app);

    let resultAuth = await req
    .post('/auth')
    .send({ nickname: 'Gabriel' })
    .expect(201);

    token = resultAuth.body.token;

  });

  it('Create music', async () => {

    
    const resGenre = await req
    .post('/genre')
    .send({ 
      name: "Rap" 
    })
    .set('Authorization', `Bearer ${token}`);
    expect(resGenre.status).toEqual(201);
    expect(resGenre.body).toBeTruthy();

    const resMusic = await req
    .post('/music')
    .send({ 
      name: "Demorô", 
      author: "Criolo", 
      url: "criolo-demoro.mp3", 
      genreId: resGenre.body.data.id 
    })
    .set('Authorization', `Bearer ${token}`);
    expect(resMusic.status).toEqual(201);
    expect(resMusic.body).toBeTruthy();

  });

  it('Update music', async () => {

    const resGenre = await req
    .post('/genre').send({ 
      name: "Rosque" 
    })
    .set('Authorization', `Bearer ${token}`);
    expect(resGenre.status).toEqual(201);
    expect(resGenre.body).toBeTruthy();

    const resMusic = await req
    .post('/music')
    .send({ 
      name: "Misery Business", 
      author: "Paramore", 
      url: "paramore-misery-business.mp3", 
      genreId: resGenre.body.data.id 
    })
    .set('Authorization', `Bearer ${token}`);
    expect(resMusic.status).toEqual(201);
    expect(resMusic.body).toBeTruthy();

    const resGenre2 = await req
    .post('/genre')
    .send({ name: "Punk" })
    .set('Authorization', `Bearer ${token}`);
    expect(resGenre.status).toEqual(201);
    expect(resGenre.body).toBeTruthy();

    const resMusicUpdate = await req
    .patch(`/music/${resMusic.body.data.id}`)
    .send({ genreId:resGenre2.body.data.id })
    .set('Authorization', `Bearer ${token}`);
    expect(resMusicUpdate.status).toEqual(200);
    expect(resMusicUpdate.body).toBeTruthy();
    expect(resMusicUpdate.body.data).not.toBeNull();
  });

  it('Find all musics', async () => {

    const resGenre = await req.post('/genre')
    .send({ 
      name: "Rosque"
     })
    .set('Authorization', `Bearer ${token}`);
    expect(resGenre.status).toEqual(201);
    expect(resGenre.body).toBeTruthy();

    const resMusic = await req.post('/music')
    .send({ 
      name: "Misery Business", 
      author: "Paramore", 
      url: "paramore-misery-business.mp3",
      genreId: resGenre.body.data.id })
    .set('Authorization', `Bearer ${token}`);
    expect(resMusic.status).toEqual(201);
    expect(resMusic.body).toBeTruthy();

    const resGenre2 = await req.post('/genre')
    .send({ 
      name: "Punk" 
    })
    .set('Authorization', `Bearer ${token}`);
    expect(resGenre2.status).toEqual(201);
    expect(resGenre2.body).toBeTruthy();

    const resMusic2 = await req.post('/music')
    .send({ 
      name: "Misery Business", 
      author: "Paramore", 
      url: "paramore-misery-business.mp3",
      genreId: resGenre2.body.data.id })
    .set('Authorization', `Bearer ${token}`);
    expect(resMusic2.status).toEqual(201);
    expect(resMusic2.body).toBeTruthy();

    const resMusicUpdate = await req.get('/music')
    .send({ genreId:resGenre2.body.data.id })
    .set('Authorization', `Bearer ${token}`);
    expect(resMusicUpdate.status).toEqual(200);
    expect(resMusicUpdate.body).toBeTruthy();
    expect(resMusicUpdate.body.data).not.toBeNull();
  });

  it('Find one music', async () => {

    const resGenre = await req.post('/genre')
    .send({ 
      name: "Tá ouvindo rosque?"
     })
    .set('Authorization', `Bearer ${token}`);
    expect(resGenre.status).toEqual(201);
    expect(resGenre.body).toBeTruthy();

    const resMusic = await req.post('/music')
    .send({ 
      name: "Cilada", 
      author: "Molejo", 
      url: "molejo-cilada.mp3",
      genreId: resGenre.body.data.id })
    .set('Authorization', `Bearer ${token}`);
    expect(resMusic.status).toEqual(201);
    expect(resMusic.body).toBeTruthy();
    
    const resMusicFindOne = await req
    .patch(`/music/${resMusic.body.data.id}`)
    .send()
    .set('Authorization', `Bearer ${token}`);
    expect(resMusicFindOne.status).toEqual(200);
    expect(resMusicFindOne.body).toBeTruthy();
    expect(resMusicFindOne.body.data).not.toBeNull();

  });

  it('Delete music', async () => {
    const resGenre = await req
      .post('/genre')
      .send({ name: 'Pagodão da Massa' })
      .set('Authorization', `Bearer ${token}`);
    expect(resGenre.status).toEqual(201);
    expect(resGenre.body).toBeTruthy();

    const resMusic = await req
      .post('/music')
      .send({
        name: 'Patricinha de Olho Azul',
        author: 'Bom Gosto',
        url: 'bom-gosto-patricinha.mp3',
        genreId: resGenre.body.data.id,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(resMusic.status).toEqual(201);
    expect(resMusic.body).toBeTruthy();

    const resMusicDelete = await req
      .delete(`/music/${resMusic.body.data.id}`)
      .send()
      .set('Authorization', `Bearer ${token}`);
    expect(resMusicDelete.status).toEqual(200);
    expect(resMusicDelete.body).toBeTruthy();

    const resMusicFindOne = await req
    .patch(`/music/${resMusic.body.data.id}`)
    .send()
    .set('Authorization', `Bearer ${token}`);
    expect(resMusicFindOne.status).toEqual(404);
    expect(resMusicFindOne.body.error).toBeTruthy();
  });

});
