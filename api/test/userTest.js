require('dotenv').config();
require('rootpath')();

const   chai = require('chai'),
    expect = chai.expect,
    chaiHttp = require('chai-http'),
    { URL, TEST_PSEUDO, TEST_PASSWORD } = process.env,
    fetch = require('../utils/fetch');

let tokenInf = undefined;
let tokenShop = undefined;
let userId = undefined;

chai.use(chaiHttp);

describe('Request USER API', () => {

    describe('/inf/register', () => {

        it('inf register pseudo, password invalid format', function(done) {
            chai.request(`${URL}`)
                .post('/inf/register')
                .send({ pseudo: 'qwe', password: 'cfg'})
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('inf register without password', function(done) {
            chai.request(`${URL}`)
                .post('/inf/register')
                .send({ pseudo: 'TestInfUserRegister'})
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('inf register without pseudo', function(done) {
            chai.request(`${URL}`)
                .post('/inf/register')
                .send({ password: '123'})
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('Normal inf register', function(done) {
            chai.request(`${URL}`)
                .post('/inf/register')
                .send({ pseudo: 'TestInfUserRegister', password: 'Qwerty123', email: "TestInfUserRegister@neoconnect.com", theme: "mode"})
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('token');
                    expect(res.body.token).to.be.a('string');
                    tokenInf = res.body.token;
                    done();
                });
        });

    });

    describe('/shop/register', () => {

        it('shop register pseudo, password invalid format', function(done) {
            chai.request(`${URL}`)
                .post('/shop/register')
                .send({ pseudo: 'qwe', password: 'cfg'})
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('shop register without password', function(done) {
            chai.request(`${URL}`)
                .post('/shop/register')
                .send({ pseudo: 'TestShopUserRegister'})
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('shop register without pseudo', function(done) {
            chai.request(`${URL}`)
                .post('/shop/register')
                .send({ password: '123'})
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('Normal shop register', function(done) {
            chai.request(`${URL}`)
                .post('/shop/register')
                .send({ pseudo: 'TestShopUserRegister', password: 'Qwerty123', email: "TestShopUserRegister@neoconnect.com", theme: "mode"})
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('token');
                    expect(res.body.token).to.be.a('string');
                    tokenShop = res.body.token;
                    done();
                });
        });

    });

    /*describe('/user/report/:id', () => {

        it('bad token', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .post('/user/report/1')
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNTM0ODAxODYtOTI1MC00M2E2LWI1YzAtNjQ3NDVjYjRmOGY0IiwiaWF0IjoxNTgyMDQwNDE4LCJleHAiOjE1ODIxMjY4MTh9.xGVGK20bLmh_WHhGbNUN1u_dQwxlkDBkHqKKLwzA__A')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('bad field', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .post('/user/report/1')
                .set('Authorization', `Bearer ${tokenInf}`)
                .send({ pseudo: "leBot", subject: "report"})
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('normal report', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .post('/user/report/1')
                .set('Authorization', `Bearer ${tokenInf}`)
                .send({ pseudo: "leBot", subject: "report", message: "C'est un bot"})
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();                               // <= Call done to signal callback end
                });
        });

    });*/

    describe('/user/suggestion', () => {

        it('normal request', function(done) {
            chai.request(`${URL}`)
                .get('/user/suggestion')
                .set('Authorization', `Bearer ${tokenInf}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

    });

    describe('/user/delete', () => {

        it('normal request delete Inf', function(done) {
            chai.request(`${URL}`)
                .delete('/user/delete')
                .set('Authorization', `Bearer ${tokenInf}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('normal request delete Shop', function(done) {
            chai.request(`${URL}`)
                .delete('/user/delete')
                .set('Authorization', `Bearer ${tokenShop}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

    });

});