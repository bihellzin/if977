import supertest, { Test } from 'supertest';
import typeorm from 'typeorm';
import faker from 'faker';
import express from 'express';
import App from '../app';
import Database from '../databases';
import { UserController } from './user.controller';
import { AuthController } from './auth.controller';


let connection: typeorm.Connection;
let app: express.Application;
let appAuth: express.Application;
let req: supertest.SuperTest<supertest.Test>;
let token: string;
describe('User Suite', () => {
  beforeAll(async () => {

    connection = await Database.createConnection();
    app = new App([new UserController(), new AuthController()]).app;

    req = supertest(app);

    let resultAuth = await req
    .post('/auth')
    .send({ nickname: 'Gabriel' })
    .expect(201);

    token = resultAuth.body.token;


  });

  it('Create', async () => {
    
    const res = await req.post('/user').send({ nickname: 'Gabriel', avatar: "avatar.path.gabriel", })
    .set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(201);
    expect(res.body).toBeTruthy();
  });

  it('Find One', async() => {

    const res = await req.post('/user').send({ nickname: 'João', avatar: "avatar.path.joao", })
    .set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(201);


    const resfind = await req.get(`/user/${res.body.data.id}`).send()
    .set('Authorization', `Bearer ${token}`);
    expect(resfind.status).toEqual(200);
    expect(resfind.body).toBeTruthy();


  })

  it('Find All', async() => {

    const resUser = await req.post('/user').send({ nickname: 'Julio', avatar: "avatar.path.julio", })
    .set('Authorization', `Bearer ${token}`);
    expect(resUser.status).toEqual(201);

    const resUser2 = await req.post('/user').send({ nickname: 'Bruno', avatar: "avatar.path.bruno", })
    .set('Authorization', `Bearer ${token}`);
    expect(resUser2.status).toEqual(201);

    const res = await req.get('/user').send()
    .set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(res.body).toBeTruthy();



  })

  it('Update', async() => {

    const resUser = await req.post('/user').send({ nickname: 'RenatoOo', avatar: "avatar.path.renato.error", })
    .set('Authorization', `Bearer ${token}`);
    expect(resUser.status).toEqual(201);

    const res = await req.patch(`/user/${resUser.body.data.id}`).send({ nickname: 'Renato', avatar: "avatar.path.renato", })
    .set('Authorization', `Bearer ${token}`);
    expect(res.body).toBeTruthy();
    expect(res.status).toEqual(200);
    
   })

   it('Delete', async() => {

    const resUser = await req.post('/user').send({ nickname: 'Guerra', avatar: "avatar.path.guerra", })
    .set('Authorization', `Bearer ${token}`);
    expect(resUser.body).toBeTruthy();
    expect(resUser.status).toEqual(201);


    const res = await req.delete(`/user/${resUser.body.data.id}`).send()
    .set('Authorization', `Bearer ${token}`);
    expect(res.body).toBeTruthy();
    expect(res.status).toEqual(200);

    const resFindall = await req.get('/user').send()
    .set('Authorization', `Bearer ${token}`);
    expect(resFindall.status).toEqual(200);
    expect(resFindall.body).toBeTruthy();
    
   })

});
