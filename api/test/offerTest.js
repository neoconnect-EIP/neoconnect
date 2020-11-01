require('dotenv').config();
require('rootpath')();

const   chai = require('chai'),
    expect = chai.expect,
    chaiHttp = require('chai-http'),
    { URL, TEST_PSEUDO, TEST_PASSWORD } = process.env,
    fetch = require('../utils/fetch');

let token = undefined;
let offerId = undefined;
let userId = undefined;
let userPseudo = undefined;
let tokenInfFollow = undefined;

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

    });

    describe('POST /offer/insert', () => {

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

    });

});