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
let tokenInf = undefined;

chai.use(chaiHttp);

describe('Request Offer API', () => {

    describe('Create Shop account for Offer tests', () => {

        it('Test Normal shop register', function(done) {
            chai.request(`${URL}`)
                .post('/shop/register')
                .send({ pseudo: 'TestShopOfferRegister', password: 'Qwerty123', email: "TestShopOfferRegister@neoconnect.com", theme: "mode"})
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('token');
                    expect(res.body.token).to.be.a('string');
                    token = res.body.token;
                    done();
                });
        });

        it('Test Normal GET /shop/me', function(done) {
            chai.request(`${URL}`)
                .get('/shop/me')
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('id');
                    idShop = res.body.id;
                    done();
                });
        });

        it('Test Normal inf register', function(done) {
            chai.request(`${URL}`)
                .post('/inf/register')
                .send({ pseudo: 'TestInfOfferRegister', password: 'Qwerty123', email: "TestInfOfferRegister@neoconnect.com", theme: "mode"})
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

    describe('POST /offer/insert', () => {

        it('test with bad token', function(done) {
            chai.request(`${URL}`)
                .post('/offer/insert')
                .set('Authorization', `Bearer ghjhgfgh78j9okpl-pkoijuhyt65rftgyh`)
                .send({ productName: 'tee-shirt bleue', productSex: 'homme', productDesc: "tee-shirt bleue 100% coton"})
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('Test Normal shop register', function(done) {
            chai.request(`${URL}`)
                .post('/offer/insert')
                .set('Authorization', `Bearer ${token}`)
                .send({ productName: 'tee-shirt bleue', productSex: 'homme', productDesc: "tee-shirt bleue 100% coton"})
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('id');
                    offerId = res.body.id;
                    done();
                });
        });

    });

    describe('GET /offer/list', () => {

        it('bad request bad token', function(done) {
            chai.request(`${URL}`)
                .get('/offer/list')
                .set('Authorization', `Bearer w2w2w2w2w2dfrfed`)
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('normal request', function(done) {
            chai.request(`${URL}`)
                .get('/offer/list')
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

    });

    describe('GET /offer/suggestion',() => {

        it('bad request bad token', function(done) {
            chai.request(`${URL}`)
                .get('/offer/suggestion')
                .set('Authorization', `Bearer ssssqs2s2s2s2s2s2`)
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('normal request', function(done) {
            chai.request(`${URL}`)
                .get('/offer/suggestion')
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

    });

    describe('GET /offer/:id',() => {

        it('bad request bad token', function(done) {
            chai.request(`${URL}`)
                .get(`/offer/${offerId}`)
                .set('Authorization', `Bearer ssssqs2s2s2s2s2s2`)
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('bad request bad id', function(done) {
            chai.request(`${URL}`)
                .get(`/offer/2342232`)
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('normal request', function(done) {
            chai.request(`${URL}`)
                .get(`/offer/${offerId}`)
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

    });

    describe('GET /offer/shop/:id',() => {

        it('bad request bad token', function(done) {
            chai.request(`${URL}`)
                .get(`/offer/shop/${idShop}`)
                .set('Authorization', `Bearer ssssqs2s2s2s2s2s2`)
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('bad request bad id', function(done) {
            chai.request(`${URL}`)
                .get(`/offer/shop/2342232`)
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('normal request', function(done) {
            chai.request(`${URL}`)
                .get(`/offer/shop/${idShop}`)
                .set('Authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

    });

    describe('PUT /offer/:id', () => {

        it('test with bad token', function(done) {
            chai.request(`${URL}`)
                .put(`/offer/${offerId}`)
                .set('Authorization', `Bearer ghjhgfgh78j9okpl-pkoijuhyt65rftgyh`)
                .send({ productName: 'tee-shirt bleue', productSex: 'homme', productDesc: "tee-shirt bleue 100% coton"})
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('test with bad body', function(done) {
            chai.request(`${URL}`)
                .put(`/offer/23233232`)
                .set('Authorization', `Bearer ${token}`)
                .send({ productName: 'tee-shirt bleue', productSex: 'homme', productDesc: "tee-shirt bleue 100% coton"})
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('normal request', function(done) {
            chai.request(`${URL}`)
                .put(`/offer/${offerId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ productName: 'tee-shirt bleue', productSex: 'femme', productDesc: "tee-shirt bleue 100% coton"})
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