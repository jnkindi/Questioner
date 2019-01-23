
import { meetups, rsvps, questions, users, validator, writeInDb, validationErrors } from '../helpers/index';

const addMeetup = (req, res) => {
    // Validate Data
    const {
        error
    } = validator('meetup', req.body);
    if (error) {
        return validationErrors(res, error);
    }
    const meetup = {
        id: meetups.length + 1,
        createdOn: new Date().toISOString().replace('T', ' ').replace(/\..*$/, ''),
        location: req.body.location,
        images: req.body.images,
        topic: req.body.topic,
        description: req.body.description,
        happeningOn: req.body.happeningOn,
        tags: req.body.tags,
    };
    meetups.push(meetup);
    if (writeInDb('meetup', meetups)) {
        const response = {
            status: 200,
            data: [{
                topic: req.body.topic,
                description: req.body.description,
                location: req.body.location,
                happeningOn: req.body.happeningOn,
                tags: req.body.tags
            }]
        };
        res.send(response);
    }
    return true;
};

const getMeetups = (req, res) => {
    const response = {
        status: 200,
        data: meetups
    };
    res.send(response);
};

const upcomingMeetups = (req, res) => {
    // Sort by date in ascending order for getting upcoming
    meetups.sort((a, b) => {
        const result = new Date(a.happeningOn) - new Date(b.happeningOn);
        return result;
    });
    const data = [];
    meetups.forEach((meetup) => {
        // Showing only upcoming
        if (new Date(meetup.happeningOn) >= new Date()) {
            data.push(meetup);
        }
    });
    const response = {
        status: 200,
        data
    };
    res.send(response);
};

const specificMeetup = (req, res) => {
    const meetup = meetups.find(m => m.id === parseInt(req.params.id, 10));
    if (!meetup) {
        return res.status(404).send({
            status: 404,
            error: 'Meetup with given ID was not found'
        });
    }
    const response = {
        status: 200,
        data: [{
            id: meetup.id,
            topic: meetup.topic,
            description: meetup.description,
            location: meetup.location,
            happeningOn: meetup.happeningOn,
            tags: meetup.tags
        }]
    };
    return res.send(response);
};

const rsvpMeetup = (req, res) => {
    // Check meetup exists
    const meetup = meetups.find(m => m.id === parseInt(req.params.id, 10));
    if (!meetup) {
        return res.status(404).send({
            status: 404,
            error: 'Meetup with given ID was not found'
        });
    }
    // Check user exists
    const user = users.find(u => u.id === parseInt(req.body.user, 10));
    if (!user) {
        return res.status(404).send({
            status: 404,
            error: 'User with given ID was not found'
        });
    }
    // Validate Data
    const {
        error
    } = validator('rsvps', req.body);
    if (error) {
        return validationErrors(res, error);
    }
    const {
        topic
    } = meetups.find(m => m.id === parseInt(req.params.id, 10));
    const rsvp = {
        id: rsvps.length + 1,
        meetup: req.params.id,
        user: req.body.user,
        response: req.body.response,
    };
    rsvps.push(rsvp);
    if (writeInDb('rsvps', rsvps)) {
        const response = {
            status: 200,
            data: [{
                meetup: req.body.meetup,
                topic,
                status: req.body.response,
            }]
        };
        res.send(response);
    }
    return true;
};

const deleteMeetup = (req, res) => {
    // Validate Data
    const meetup = meetups.find(m => m.id === parseInt(req.params.id, 10));
    if (!meetup) {
        return res.status(404).send({
            status: 404,
            error: 'Meetup with given ID was not found'
        });
    }
    const index = meetups.indexOf(meetup);
    meetups.splice(index, 1);
    if (writeInDb('meetup', meetups)) {
        const response = {
            status: 200,
            data: 'Meetup deleted'
        };
        res.send(response);
    }
    return true;
};

const addQuestion = (req, res) => {
    // Validate Data
    const meetup = meetups.find(m => m.id === parseInt(req.params.id, 10));
    if (!meetup) {
        return res.status(404).send({
            status: 404,
            error: 'Meetup with given ID was not found'
        });
    }
    // Validate Data
    const { error } = validator('question', req.body);
    if (error) {
        return validationErrors(res, error);
    }
    const question = {
        id: questions.length + 1,
        createdOn: new Date().toISOString().replace('T', ' ').replace(/\..*$/, ''),
        createdBy: req.body.createdBy,
        meetup: parseInt(req.params.id, 10),
        title: req.body.title,
        body: req.body.body,
        upvotes: 0,
        downvotes: 0
    };
    questions.push(question);
    if (writeInDb('question', questions)) {
        const response = {
            status: 200,
            data: [{
                user: req.body.createdBy,
                meetup: req.body.id,
                title: req.body.title,
                body: req.body.body
            }]
        };
        res.send(response);
    }
    return true;
};
const getQuestions = (req, res) => {
    const meetup = meetups.find(m => m.id === parseInt(req.params.id, 10));
    if (!meetup) {
        return res.status(404).send({
            status: 404,
            error: 'Meetup with given ID was not found'
        });
    }
    const questionList = questions.filter(q => q.meetup === parseInt(req.params.id, 10)) || [];
    const response = {
        status: 200,
        data: questionList
    };
    return res.send(response);
};

export {
    addMeetup,
    getMeetups,
    upcomingMeetups,
    specificMeetup,
    rsvpMeetup,
    deleteMeetup,
    addQuestion,
    getQuestions
};