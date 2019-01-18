const request = require('supertest');
const { expect } = require('chai');

const app = require('../app');

const fixtures = require('./fixtures');

const { meetupPost } = fixtures;
const { rsvpPost } = fixtures;

const meetupHelpers = require('../helpers/meetups');

const { meetups } = meetupHelpers;
const meetupMaxID = meetups.length + 1;


const meetupTest = () => {
    describe('Meetup Tests', () => {
        it('Should add new meetup...', (done) => {
            request(app)
                .post('/api/v1/meetups')
                .send(meetupPost)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.status).to.be.equal(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body.data[0].topic).to.be.equal(meetupPost.topic);
                    expect(res.body.data[0].description).to.be.equal(meetupPost.description);
                    expect(res.body.data[0].location).to.be.equal(meetupPost.location);
                    expect(res.body.data[0].happeningOn).to.be.equal(meetupPost.happeningOn);
                    expect(res.body.data[0].tags.length).to.be.equal(meetupPost.tags.length);
                    done();
                });
        });

        it('Should fetch all meetups...', (done) => {
            request(app)
                .get('/api/v1/meetups')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.status).to.be.equal(200);
                    expect(res.body).to.be.a('object');
                    const maxLen = res.body.data.length - 1;
                    expect(res.body.data[maxLen].topic).to.be.equal(meetupPost.topic);
                    expect(res.body.data[maxLen].description).to.be.equal(meetupPost.description);
                    expect(res.body.data[maxLen].location).to.be.equal(meetupPost.location);
                    expect(res.body.data[maxLen].happeningOn).to.be.equal(meetupPost.happeningOn);
                    expect(res.body.data[maxLen].tags.length).to.be.equal(meetupPost.tags.length);
                    done();
                });
        });

        it('Should fetch all upcoming meetups...', (done) => {
            request(app)
                .get('/api/v1/meetups/upcoming')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.status).to.be.equal(200);
                    expect(res.body).to.be.a('object');
                    done();
                });
        });

        it('Should fetch meetup by ID...', (done) => {
            request(app)
                .get(`/api/v1/meetups/${meetupMaxID}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.status).to.be.equal(200);
                    expect(res.body).to.be.a('object');
                    const maxLen = res.body.data.length - 1;
                    expect(res.body.data[maxLen].topic).to.be.equal(meetupPost.topic);
                    expect(res.body.data[maxLen].description).to.be.equal(meetupPost.description);
                    expect(res.body.data[maxLen].location).to.be.equal(meetupPost.location);
                    expect(res.body.data[maxLen].happeningOn).to.be.equal(meetupPost.happeningOn);
                    expect(res.body.data[maxLen].tags.length).to.be.equal(meetupPost.tags.length);
                    expect(res.body.data.length).to.deep.equal(1);
                    done();
                });
        });
        it('Should add RSVP to meetup...', (done) => {
            request(app)
                .post(`/api/v1/meetups/${meetupMaxID}/rsvps`)
                .send(rsvpPost)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.status).to.be.equal(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body.data[0].meetup).to.be.equal(rsvpPost.meetup);
                    expect(res.body.data[0].status).to.be.equal(rsvpPost.response);
                    done();
                });
        });
        it('Should delete meetup...', (done) => {
            request(app)
                .delete(`/api/v1/meetups/${meetupMaxID}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(res.body.status).to.be.equal(200);
                    expect(res.body.data).to.be.equal('Meetup deleted');
                    expect(res.body).to.be.a('object');
                    done();
                });
        });
    });
};

module.exports = {
    meetupTest
};