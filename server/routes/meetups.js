
import express from 'express';

import Meetups from '../controllers/meetups';

const { addMeetup, getMeetups, upcomingMeetups, specificMeetup, rsvpMeetup, deleteMeetup, addQuestion, getQuestions, addMeetupImages, removeMeetupImages, addMeetupTags, removeMeetupTags, updateMeetup } = Meetups;

const router = express.Router();

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

// Add images on a specific meetup record.
router.post('/:id/images', addMeetupImages);

// Delete images on  a specific meetup record.
router.delete('/:id/images', removeMeetupImages);

// Add tags on a specific meetup record.
router.post('/:id/tags', addMeetupTags);

// Delete tags on  a specific meetup record.
router.delete('/:id/tags', removeMeetupTags);

// Delete meetup.
router.put('/:id', updateMeetup);

export default router;