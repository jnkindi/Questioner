const request = require('supertest');
const { expect } = require('chai');

const app = require('../app');

const fixtures = require('./fixtures');

const usersTest = () => {
    describe('Users Tests', () => {
        it('Adding new user...', (done) => {
            request(app)
                .post('/api/v1/auth/signup')
                .send(fixtures.user_post)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.status).to.be.equal(200);
                    expect(res.body).to.be.a('object');
                    done();
                });
        });
    });
};

const loginTest = () => {
    describe('Login API Tests', () => {
        it('Should test invalid Credentials...', (done) => {
            request(app)
                .post('/api/v1/auth/login')
                .send(fixtures.user_login_invalid)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .end((err, res) => {
                    expect(res.body.status).to.be.equal(400);
                    expect(res.body).to.be.a('object');
                    expect(res.body.error[0]).to.be.equal('"username" length must be at least 5 characters long');
                    done();
                });
        });
        it('Should test valid Credentials...', (done) => {
            request(app)
                .post('/api/v1/auth/login')
                .send(fixtures.user_login)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(res.body).to.be.a('object');
                    done();
                });
        });
    });
};

module.exports = {
    usersTest,
    loginTest
};