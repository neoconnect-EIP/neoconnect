require('dotenv').config();
require('rootpath')();

const   chai = require('chai'),
    expect = chai.expect,
    chaiHttp = require('chai-http'),
    { URL, TEST_PSEUDO, TEST_PASSWORD } = process.env,
    fetch = require('../utils/fetch');

let token = undefined;
let userId = undefined;

chai.use(chaiHttp);

describe('Request URL API', () => {

    describe('API general tests', () => {

        it('bad url get', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get('/efiojweioqe')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('bad url post', function(done) {
            chai.request(`${URL}`)
                .post('/dcdjbanna')
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

    describe('API login tests', () => {

        it('normal login', function(done) {
            chai.request(`${URL}`)
                .post('/login')
                .send({ pseudo: TEST_PSEUDO + "Inf", password: TEST_PASSWORD})
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('token');
                    expect(res.body.token).to.be.a('string');
                    expect(res.body).to.have.property('userId');
                    expect(res.body.userId).to.be.a('number');
                    token = res.body.token;
                    userId = res.body.userId;
                    done();
                });
        });

        it('login with bad body', function(done) {
            chai.request(`${URL}`)
                .post('/login')
                .send({ login: 'fdjkdsk', pwd: 'sdlsdlsdl'})
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('login with good body bad user', function(done) {
            chai.request(`${URL}`)
                .post('/login')
                .send({ pseudo: 'fdjkdsk', password: 'sdlsdlsdl'})
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });

    });

});