require('dotenv').config();
require('rootpath')();

const   chai = require('chai'),
    expect = chai.expect,
    chaiHttp = require('chai-http'),
    { URL, TEST_PSEUDO, TEST_PASSWORD } = process.env,
    fetch = require('../utils/fetch');

let token = undefined;
let userId = undefined;
let userPseudo = undefined;

chai.use(chaiHttp);

describe('Request Influencer API', () => {

    describe('Inf Register for test', () => {

        it('Inf Test Normal inf register', function(done) {
            chai.request(`${URL}`)
                .post('/inf/register')
                .send({ pseudo: 'TestInfModelRegister', password: 'Qwerty123', email: "TestInfModelUserRegister@neoconnect.com", theme: "mode"})
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('token');
                    expect(res.body.token).to.be.a('string');
                    token = res.body.token;
                    done();
                });
        });

    });

    describe('GET /inf/me', () => {

        it('bad token', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get('/inf/me')
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNTM0ODAxODYtOTI1MC00M2E2LWI1YzAtNjQ3NDVjYjRmOGY0IiwiaWF0IjoxNTgyMDQwNDE4LCJleHAiOjE1ODIxMjY4MTh9.xGVGK20bLmh_WHhGbNUN1u_dQwxlkDBkHqKKLwzA__A')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('normal request', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get('/inf/me')
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    userId = res.body.id;
                    userPseudo = res.body.pseudo;
                    done();                               // <= Call done to signal callback end
                });
        });

    });

    describe('PUT /inf/me', () => {

        it('bad token', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .put('/inf/me')
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNTM0ODAxODYtOTI1MC00M2E2LWI1YzAtNjQ3NDVjYjRmOGY0IiwiaWF0IjoxNTgyMDQwNDE4LCJleHAiOjE1ODIxMjY4MTh9.xGVGK20bLmh_WHhGbNUN1u_dQwxlkDBkHqKKLwzA__A')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('normal request', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .put('/inf/me')
                .set('Authorization', `Bearer ${token}`)
                .send({city: 'Paris'})
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();                               // <= Call done to signal callback end
                });
        });

    });

    describe('GET /inf/listShop', () => {

        it('bad token', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get('/inf/listShop')
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNTM0ODAxODYtOTI1MC00M2E2LWI1YzAtNjQ3NDVjYjRmOGY0IiwiaWF0IjoxNTgyMDQwNDE4LCJleHAiOjE1ODIxMjY4MTh9.xGVGK20bLmh_WHhGbNUN1u_dQwxlkDBkHqKKLwzA__A')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('normal request', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get('/inf/listShop')
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();                               // <= Call done to signal callback end
                });
        });

    });

    describe('GET /inf/:id', () => {

        it('bad token', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get(`/inf/${userId}`)
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNTM0ODAxODYtOTI1MC00M2E2LWI1YzAtNjQ3NDVjYjRmOGY0IiwiaWF0IjoxNTgyMDQwNDE4LCJleHAiOjE1ODIxMjY4MTh9.xGVGK20bLmh_WHhGbNUN1u_dQwxlkDBkHqKKLwzA__A')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('request with bad id', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get(`/inf/22222`)
                .set('Authorization',`Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('normal request', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get(`/inf/${userId}`)
                .set('Authorization',`Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();                               // <= Call done to signal callback end
                });
        });

    });

    describe('POST /inf/search', () => {

        it('bad token', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .post(`/inf/search`)
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNTM0ODAxODYtOTI1MC00M2E2LWI1YzAtNjQ3NDVjYjRmOGY0IiwiaWF0IjoxNTgyMDQwNDE4LCJleHAiOjE1ODIxMjY4MTh9.xGVGK20bLmh_WHhGbNUN1u_dQwxlkDBkHqKKLwzA__A')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('request with bad body', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .post(`/inf/search`)
                .set('Authorization',`Bearer ${token}`)
                .send({login:'badLogin'})
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('request user doest\'t exist', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .post(`/inf/search`)
                .set('Authorization',`Bearer ${token}`)
                .send({pseudo:'wqwqw1121wdd;s;sd;'})
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('normal request', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .post(`/inf/search`)
                .set('Authorization',`Bearer ${token}`)
                .send({pseudo: userPseudo})
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();                               // <= Call done to signal callback end
                });
        });

    });

    describe('DELETE /user/delete', () => {

        it('normal request delete Inf', function (done) {
            chai.request(`${URL}`)
                .delete('/user/delete')
                .set('Authorization', `Bearer ${token}`)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

    });

});