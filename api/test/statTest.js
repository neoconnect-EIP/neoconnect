require('dotenv').config();
require('rootpath')();

const   chai = require('chai'),
    expect = chai.expect,
    chaiHttp = require('chai-http'),
    { URL, TEST_PSEUDO, TEST_PASSWORD } = process.env,
    fetch = require('../utils/fetch');

let token = undefined;
let offerId = undefined;
let idShop = undefined;
let idInf = undefined;
let tokenInf = undefined;

chai.use(chaiHttp);

describe('Request Stat API', () => {

    describe('Create Shop account for Offer tests', () => {

        it('Test Normal shop register', function (done) {
            chai.request(`${URL}`)
                .post('/shop/register')
                .send({
                    pseudo: 'TestShopStatRegister',
                    password: 'Qwerty123',
                    email: "TestShopStatRegister@neoconnect.com",
                    theme: "mode"
                })
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('token');
                    expect(res.body.token).to.be.a('string');
                    token = res.body.token;
                    done();
                });
        });

        it('Test Normal GET /shop/me', function (done) {
            chai.request(`${URL}`)
                .get('/shop/me')
                .set('Authorization', `Bearer ${token}`)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('id');
                    idShop = res.body.id;
                    done();
                });
        });

        it('Test Normal inf register', function (done) {
            chai.request(`${URL}`)
                .post('/inf/register')
                .send({
                    pseudo: 'TestInfStatRegister',
                    password: 'Qwerty123',
                    email: "TestInfStatRegister@neoconnect.com",
                    theme: "mode"
                })
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('token');
                    expect(res.body.token).to.be.a('string');
                    tokenInf = res.body.token;
                    done();
                });
        });

        it('Test Normal GET /inf/me', function (done) {
            chai.request(`${URL}`)
                .get('/inf/me')
                .set('Authorization', `Bearer ${tokenInf}`)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('id');
                    idInf = res.body.id;
                    done();
                });
        });


    });

    describe('POST /offer/insert', () => {

        it('test with bad token', function (done) {
            chai.request(`${URL}`)
                .post('/offer/insert')
                .set('Authorization', `Bearer ghjhgfgh78j9okpl-pkoijuhyt65rftgyh`)
                .send({productName: 'tee-shirt bleue', productSex: 'homme', productDesc: "tee-shirt bleue 100% coton"})
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('Test Normal shop register', function (done) {
            chai.request(`${URL}`)
                .post('/offer/insert')
                .set('Authorization', `Bearer ${token}`)
                .send({productName: 'tee-shirt bleue', productSex: 'homme', productDesc: "tee-shirt bleue 100% coton"})
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('id');
                    offerId = res.body.id;
                    done();
                });
        });

    });

    describe('GET /user/mark/average/:id', () => {

        it('test with bad token', function (done) {
            chai.request(`${URL}`)
                .get(`/user/mark/average/${idInf}`)
                .set('Authorization', `Bearer ghjhgfgh78j9okpl-pkoijuhyt65rftgyh`)
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('normal request', function (done) {
            chai.request(`${URL}`)
                .get(`/user/mark/average/${idInf}`)
                .set('Authorization', `Bearer ${tokenInf}`)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

    });

    describe('GET /offer/lastMonth/:id', () => {

        it('test with bad token', function (done) {
            chai.request(`${URL}`)
                .get(`/offer/lastMonth/${idShop}`)
                .set('Authorization', `Bearer ghjhgfgh78j9okpl-pkoijuhyt65rftgyh`)
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('normal request', function (done) {
            chai.request(`${URL}`)
                .get(`/offer/lastMonth/${idShop}`)
                .set('Authorization', `Bearer ${tokenInf}`)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

    });

    describe('GET /actuality', () => {

        it('test with bad token', function (done) {
            chai.request(`${URL}`)
                .get(`/actuality`)
                .set('Authorization', `Bearer ghjhgfgh78j9okpl-pkoijuhyt65rftgyh`)
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('normal request', function (done) {
            chai.request(`${URL}`)
                .get(`/actuality`)
                .set('Authorization', `Bearer ${tokenInf}`)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

    });

    describe('DELETE /offer/:id', () => {

        it('test with bad token', function(done) {
            chai.request(`${URL}`)
                .delete(`/offer/${offerId}`)
                .set('Authorization', `Bearer ghjhgfgh78j9okpl-pkoijuhyt65rftgyh`)
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('bad offer id', function(done) {
            chai.request(`${URL}`)
                .delete(`/offer/3333333`)
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('normal request', function(done) {
            chai.request(`${URL}`)
                .delete(`/offer/${offerId}`)
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
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
                .set('Authorization', `Bearer ${tokenInf}`)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

    });


});