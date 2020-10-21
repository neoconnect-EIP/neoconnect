require('dotenv').config();
require('rootpath')();

const   chai = require('chai'),
        expect = chai.expect,
        chaiHttp = require('chai-http'),
        { URL, ADMIN_USER, ADMIN_PWD } = process.env,
        fetch = require('config/fetch');

let token = undefined;
let uuid = undefined;

chai.use(chaiHttp);

describe('Request URL API Users', () => {

    describe('API general test', () => {

        it('bad url get', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get('/api/efiojweioqe')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('bad url post', function(done) {
            chai.request(`${URL}`)
                .post('/api/dcdjbanna')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('bad token', function(done) {
            chai.request(`${URL}`)
                .post('/api/users/')
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNTM0ODAxODYtOTI1MC00M2E2LWI1YzAtNjQ3NDVjYjRmOGY0IiwiaWF0IjoxNTgyMDQwNDE4LCJleHAiOjE1ODIxMjY4MTh9.xGVGK20bLmh_WHhGbNUN1u_dQwxlkDBkHqKKLwzA__A')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });


    });

    describe('API Login Test', () => {

        it('normal login', function(done) {
            chai.request(`${URL}`)
                .post('/api/login')
                .send({ email: ADMIN_USER, password: ADMIN_PWD})
                .end(function(err, res) {
                    expect(res).to.have.status(200);

                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('jwt');
                    expect(res.body.jwt).to.be.a('string');
                    token = res.body.jwt;
                    done();
                });
        });

        it('login with bad body', function(done) {
            chai.request(`${URL}`)
                .post('/api/login')
                .send({ login: 'fdjkdsk', pwd: 'sdlsdlsdl'})
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('login with good body bad user', function(done) {
            chai.request(`${URL}`)
                .post('/api/login')
                .send({ email: 'fdjkdsk', password: 'sdlsdlsdl'})
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });

    });

    describe('add users Test', () => {

        it('add users', function(done) {
            chai.request(`${URL}`)
                .post('/api/users')
                .set('Authorization', `Bearer ${token}`)
                .send({email: 'testUser@iclo.com', password: 'testPassword', role: 'customer'})
                .end(function(err, res) {
                    if (res.status === 400) {
                        fetch.postFetch(`${URL}/api/login`, {email: 'testUser@iclo.com', password: 'testPassword'}, undefined)
                            .then(user => {
                                uuid = user.body.uuid;
                            })
                    }
                    else {
                        uuid = res.body.uuid;
                        expect(res).to.have.status(200);
                    }
                    done();
                });
        });

        it('add users with bad body', function(done) {
            chai.request(`${URL}`)
                .post('/api/users')
                .set('Authorization', `Bearer ${token}`)
                .send({login: 'testUser@iclo.com', pwd: 'testPassword'})
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('add user with user already exists', function(done) {
            chai.request(`${URL}`)
                .post('/api/users')
                .set('Authorization', `Bearer ${token}`)
                .send({email: 'testUser@iclo.com', password: 'testPassword', role: 'customer'})
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });

    });

    describe('get users Test', () => {

        it('get users', function(done) {
            chai.request(`${URL}`)
                .get('/api/users')
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('get users by id', function(done) {
            chai.request(`${URL}`)
                .get(`/api/users/${uuid}`)
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('get users by id with bad id', function(done) {
            chai.request(`${URL}`)
                .get('/api/users/dfijaiondklqnklenc,d,d')
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('get users role', function(done) {
            chai.request(`${URL}`)
                .get(`/api/users/role/${uuid}`)
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('get users role with bad id', function(done) {
            chai.request(`${URL}`)
                .get('/api/users/role/dfijaiondklqnklenc,d,d')
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });


    });

    describe('edit users Test', () => {

        it('activate user account', function (done) {
            chai.request(`${URL}`)
                .put(`/api/users/status/${uuid}`)
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('normal login', function(done) {
            chai.request(`${URL}`)
                .post('/api/login')
                .send({email: 'testUser@iclo.com', password: 'testPassword'})
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    uuid = res.body.uuid;
                    done();
                });
        });

        it('edit user', function(done) {
            chai.request(`${URL}`)
                .put(`/api/users/${uuid}`)
                .set('Authorization', `Bearer ${token}`)
                .send({email: 'testUserModif@iclo.com', password: 'testPassword'})
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('edit user with bad uuid', function(done) {
            chai.request(`${URL}`)
                .put(`/api/users/dksdksdksdkdsksdk`)
                .set('Authorization', `Bearer ${token}`)
                .send({email: 'testUserModif@iclo.com', password: 'testPassword'})
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('edit user with bad body', function(done) {
            chai.request(`${URL}`)
                .put(`/api/users/${uuid}`)
                .set('Authorization', `Bearer ${token}`)
                .send({login: 'testUserModif@iclo.com', pwd: 'testPassword'})
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });

    });

    describe('delete users Test', () => {

        it('delete user', function(done) {
            chai.request(`${URL}`)
                .delete(`/api/users/${uuid}`)
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

    });

});