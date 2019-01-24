import request from 'supertest';
import { expect } from 'chai';

import app from '../app';

import { questionPost } from './fixtures';
import { questions, meetups } from '../helpers/index';

const questionMaxID = questions.length;

const meetupmaxID = meetups.length;

const questionTest = () => {
    describe('Questions Tests', () => {
        it('Should add new question...', (done) => {
            request(app)
                .post(`/api/v1/meetups/${meetupmaxID}/questions`)
                .send(questionPost)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.be.a('object');
                    expect(res.body.status).to.be.equal(200);
                    expect(res.body.data[0].user).to.be.equal(questionPost.createdBy);
                    expect(res.body.data[0].title).to.be.equal(questionPost.title);
                    expect(res.body.data[0].body).to.be.equal(questionPost.body);
                    done();
                });
        });

        it('Should fetch meetup questions...', (done) => {
            request(app)
                .get(`/api/v1/meetups/${meetupmaxID}/questions`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.be.a('object');
                    expect(res.body.status).to.be.equal(200);
                    const maxLen = res.body.data.length - 1;
                    expect(res.body.data[maxLen].createdBy).to.be.equal(questionPost.createdBy);
                    expect(res.body.data[maxLen].title).to.be.equal(questionPost.title);
                    expect(res.body.data[maxLen].body).to.be.equal(questionPost.body);
                    done();
                });
        });

        it('Should upvote a question...', (done) => {
            request(app)
                .patch(`/api/v1/questions/${questionMaxID}/upvote`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.be.a('object');
                    expect(res.body.status).to.be.equal(200);
                    done();
                });
        });

        it('Should downvote a question...', (done) => {
            request(app)
                .patch(`/api/v1/questions/${questionMaxID}/downvote`)
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
};

export default questionTest;
