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
let tokenInfFollow = undefined;

chai.use(chaiHttp);

describe('Request Shop API', () => {

    describe('Shop Register for test', () => {

        it('Test Normal shop register', function(done) {
            chai.request(`${URL}`)
                .post('/shop/register')
                .send({ pseudo: 'TestShopModelRegister', password: 'Qwerty123', email: "TestShopModelUserRegister@neoconnect.com", theme: "mode"})
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

    describe('GET /shop/me', () => {

        it('bad token', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get('/shop/me')
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNTM0ODAxODYtOTI1MC00M2E2LWI1YzAtNjQ3NDVjYjRmOGY0IiwiaWF0IjoxNTgyMDQwNDE4LCJleHAiOjE1ODIxMjY4MTh9.xGVGK20bLmh_WHhGbNUN1u_dQwxlkDBkHqKKLwzA__A')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('normal request', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get('/shop/me')
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    userId = res.body.id;
                    userPseudo = res.body.pseudo;
                    done();                               // <= Call done to signal callback end
                });
        });

    });

    describe('PUT /shop/me', () => {

        it('bad token', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .put('/shop/me')
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNTM0ODAxODYtOTI1MC00M2E2LWI1YzAtNjQ3NDVjYjRmOGY0IiwiaWF0IjoxNTgyMDQwNDE4LCJleHAiOjE1ODIxMjY4MTh9.xGVGK20bLmh_WHhGbNUN1u_dQwxlkDBkHqKKLwzA__A')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('normal request', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .put('/shop/me')
                .set('Authorization', `Bearer ${token}`)
                .send({city: 'Paris'})
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();                               // <= Call done to signal callback end
                });
        });

    });

    describe('GET /shop/listInf', () => {

        it('bad token', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get('/shop/listInf')
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNTM0ODAxODYtOTI1MC00M2E2LWI1YzAtNjQ3NDVjYjRmOGY0IiwiaWF0IjoxNTgyMDQwNDE4LCJleHAiOjE1ODIxMjY4MTh9.xGVGK20bLmh_WHhGbNUN1u_dQwxlkDBkHqKKLwzA__A')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('normal request', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get('/shop/listInf')
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();                               // <= Call done to signal callback end
                });
        });

    });

    describe('GET /shop/:id', () => {

        it('bad token', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get(`/shop/${userId}`)
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNTM0ODAxODYtOTI1MC00M2E2LWI1YzAtNjQ3NDVjYjRmOGY0IiwiaWF0IjoxNTgyMDQwNDE4LCJleHAiOjE1ODIxMjY4MTh9.xGVGK20bLmh_WHhGbNUN1u_dQwxlkDBkHqKKLwzA__A')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('request with bad id', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get(`/shop/22222`)
                .set('Authorization',`Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('normal request', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get(`/shop/${userId}`)
                .set('Authorization',`Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();                               // <= Call done to signal callback end
                });
        });

    });

    describe('POST /shop/search', () => {

        it('bad token', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .post(`/shop/search`)
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNTM0ODAxODYtOTI1MC00M2E2LWI1YzAtNjQ3NDVjYjRmOGY0IiwiaWF0IjoxNTgyMDQwNDE4LCJleHAiOjE1ODIxMjY4MTh9.xGVGK20bLmh_WHhGbNUN1u_dQwxlkDBkHqKKLwzA__A')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('request with bad body', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .post(`/shop/search`)
                .set('Authorization',`Bearer ${token}`)
                .send({login:'badLogin'})
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('request user doest\'t exist', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .post(`/shop/search`)
                .set('Authorization',`Bearer ${token}`)
                .send({pseudo:'wqwqw1121wdd;s;sd;'})
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('normal request', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .post(`/shop/search`)
                .set('Authorization',`Bearer ${token}`)
                .send({pseudo: userPseudo})
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();                               // <= Call done to signal callback end
                });
        });

    });

    describe('Create Inf account for Follow tests', () => {

        it('Test Normal inf register', function(done) {
            chai.request(`${URL}`)
                .post('/inf/register')
                .send({ pseudo: 'TestInfFollowRegister', password: 'Qwerty123', email: "TestInfFollowRegister@neoconnect.com", theme: "mode"})
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('token');
                    expect(res.body.token).to.be.a('string');
                    tokenInfFollow = res.body.token;
                    done();
                });
        });

    });

    describe('PUT /shop/follow/:id', () => {

        it('bad token', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .put(`/shop/follow/${userId}`)
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNTM0ODAxODYtOTI1MC00M2E2LWI1YzAtNjQ3NDVjYjRmOGY0IiwiaWF0IjoxNTgyMDQwNDE4LCJleHAiOjE1ODIxMjY4MTh9.xGVGK20bLmh_WHhGbNUN1u_dQwxlkDBkHqKKLwzA__A')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('bad user type', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .put(`/shop/follow/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('bad user id', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .put(`/shop/follow/222222`)
                .set('Authorization', `Bearer ${tokenInfFollow}`)
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('normal request', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .put(`/shop/follow/${userId}`)
                .set('Authorization', `Bearer ${tokenInfFollow}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('already follow', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .put(`/shop/follow/${userId}`)
                .set('Authorization', `Bearer ${tokenInfFollow}`)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();                               // <= Call done to signal callback end
                });
        });

    });

    describe('PUT /shop/unfollow/:id', () => {

        it('bad token', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .put(`/shop/unfollow/${userId}`)
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNTM0ODAxODYtOTI1MC00M2E2LWI1YzAtNjQ3NDVjYjRmOGY0IiwiaWF0IjoxNTgyMDQwNDE4LCJleHAiOjE1ODIxMjY4MTh9.xGVGK20bLmh_WHhGbNUN1u_dQwxlkDBkHqKKLwzA__A')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('bad user type', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .put(`/shop/unfollow/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it("don't follow the shop", function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .put(`/shop/unfollow/222222`)
                .set('Authorization', `Bearer ${tokenInfFollow}`)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('normal request', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .put(`/shop/unfollow/${userId}`)
                .set('Authorization', `Bearer ${tokenInfFollow}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();                               // <= Call done to signal callback end
                });
        });

    });

    describe('GET /shop/follow/:id', () => {

        it('bad token', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get(`/shop/follow/${userId}`)
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNTM0ODAxODYtOTI1MC00M2E2LWI1YzAtNjQ3NDVjYjRmOGY0IiwiaWF0IjoxNTgyMDQwNDE4LCJleHAiOjE1ODIxMjY4MTh9.xGVGK20bLmh_WHhGbNUN1u_dQwxlkDBkHqKKLwzA__A')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('normal request', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get(`/shop/follow/${userId}`)
                .set('Authorization', `Bearer ${tokenInfFollow}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();                               // <= Call done to signal callback end
                });
        });

    });

    describe('GET /user/follow', () => {

        it('bad token', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get(`/user/follow`)
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNTM0ODAxODYtOTI1MC00M2E2LWI1YzAtNjQ3NDVjYjRmOGY0IiwiaWF0IjoxNTgyMDQwNDE4LCJleHAiOjE1ODIxMjY4MTh9.xGVGK20bLmh_WHhGbNUN1u_dQwxlkDBkHqKKLwzA__A')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('bad user type', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get(`/user/follow`)
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();                               // <= Call done to signal callback end
                });
        });

        it('normal request', function(done) { // <= Pass in done callback
            chai.request(`${URL}`)
                .get(`/user/follow`)
                .set('Authorization', `Bearer ${tokenInfFollow}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();                               // <= Call done to signal callback end
                });
        });

    });

    describe('DELETE all account using for tests', () => {

        it('normal request delete for shop account', function (done) {
            chai.request(`${URL}`)
                .delete('/user/delete')
                .set('Authorization', `Bearer ${token}`)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('normal request delete for inf account', function (done) {
            chai.request(`${URL}`)
                .delete('/user/delete')
                .set('Authorization', `Bearer ${tokenInfFollow}`)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

    });

});