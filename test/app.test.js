const request = require('supertest');
const {expect} = require('chai');

const app = require('../app');

const fixtures = require('./fixtures');

describe('Questioner API Tests', () => {

    it('Adding new meetup...', (done) => {
        request(app)
        .post('/api/v1/meetups')
        .send(fixtures.meetup_post)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.be.equal(200);
            done();
        });
    });

    it('Fetching all meetups...', (done) => {
        request(app)
        .get('/api/v1/meetups')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.be.equal(200);
            done();
        });
    });

    it('Fetching upcoming meetups...', (done) => {
        request(app)
        .get('/api/v1/meetups/upcoming')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.be.equal(200);
            done();
        });
    });
});