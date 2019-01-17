
const express = require('express');

const router = express.Router();

const meetupsRoutes = require('../controllers/meetups');

const { addMeetup, getMeetups, upcomingMeetups, specificMeetup } = meetupsRoutes;
const { rsvpMeetup, deleteMeetup, addQuestion, getQuestions } = meetupsRoutes;
// Create a meetup record
router.post('/', addMeetup);

// Fetch all meetups records.
router.get('/', getMeetups);

// Fetch all upcomint meetup records.
router.get('/upcoming/', upcomingMeetups);

// Fetch a specific meetup record.
router.get('/:id', specificMeetup);

// Respond to meetup RSVP.
router.post('/:id/rsvps', rsvpMeetup);

// Delete meetup.
router.delete('/:id', deleteMeetup);

// Create a question for a specific meetup.
router.post('/:id/questions', addQuestion);

// Fetch a specific meetup record.
router.get('/:id/questions', getQuestions);

module.exports = router;