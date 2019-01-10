const request = require('supertest');
const { expect } = require('chai');

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

    it('Fetching meetup by ID...', (done) => {
        request(app)
            .get('/api/v1/meetups/1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.body.status).to.be.equal(200);
                expect(res.body.data.length).to.deep.equal(1);
                done();
            });
    });

    it('Adding new question...', (done) => {
        request(app)
            .post('/api/v1/questions')
            .send(fixtures.question_post)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.body.status).to.be.equal(200);
                done();
            });
    });

    it('Upvoting a question...', (done) => {
        request(app)
            .patch('/api/v1/questions/1/upvote')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.body.status).to.be.equal(200);
                done();
            });
    });

    it('Downvoting a question...', (done) => {
        request(app)
            .patch('/api/v1/questions/1/downvote')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.body.status).to.be.equal(200);
                done();
            });
    });

    it('Adding RSVP to meetup...', (done) => {
        request(app)
            .post('/api/v1/meetups/1/rsvps')
            .send(fixtures.rsvp_post)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.body.status).to.be.equal(200);
                done();
            });
    });

    it('Adding new user...', (done) => {
        request(app)
            .post('/api/v1/users')
            .send(fixtures.user_post)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.body.status).to.be.equal(200);
                done();
            });
    });

    it('Delete meetup...', (done) => {
        request(app)
            .delete('/api/v1/meetups/10')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                done();
            });
    });
});

describe('Login API Tests', () => {
    it('Testing Invalid Credentials...', (done) => {
        request(app)
            .post('/auth/login')
            .send(fixtures.user_login_invalid)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal('"username" length must be at least 5 characters long');
                done();
            });
    });
    it('Testing Valid Credentials...', (done) => {
        request(app)
            .post('/auth/login')
            .send(fixtures.user_login)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                done();
            });
    });
});