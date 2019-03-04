
import express from 'express';

import Meetups from '../controllers/meetups';

import Auth from '../middlewares/auth';

const {
    addMeetup, getMeetups, upcomingMeetups, specificMeetup, rsvpMeetup, deleteMeetup, addQuestion, getQuestions, addMeetupImages, removeMeetupImages, addMeetupTags, removeMeetupTags, updateMeetup, searchMeetup, getTrendingQuestions, getPopularTags,
} = Meetups;

const router = express.Router();

// Create a meetup record
router.post('/', Auth.verifyToken, addMeetup);

// Fetch all meetups records.
router.get('/', Auth.verifyToken, getMeetups);

// Search Meetup by topic.
router.get('/search/', Auth.verifyToken, searchMeetup);

// Fetch all upcomint meetup records.
router.get('/upcoming/', Auth.verifyToken, upcomingMeetups);

// Fetch a specific meetup record.
router.get('/:id', Auth.verifyToken, specificMeetup);

// Respond to meetup RSVP.
router.post('/:id/rsvps', Auth.verifyToken, rsvpMeetup);

// Delete meetup.
router.delete('/:id', Auth.verifyToken, deleteMeetup);

// Create a question for a specific meetup.
router.post('/:id/questions', Auth.verifyToken, addQuestion);

// Fetch specific meetup questions.
router.get('/:id/questions', Auth.verifyToken, getQuestions);

// Add images on a specific meetup record.
router.post('/:id/images', Auth.verifyToken, addMeetupImages);

// Delete images on  a specific meetup record.
router.delete('/:id/images', Auth.verifyToken, removeMeetupImages);

// Add tags on a specific meetup record.
router.post('/:id/tags', Auth.verifyToken, addMeetupTags);

// Delete tags on  a specific meetup record.
router.delete('/:id/tags', Auth.verifyToken, removeMeetupTags);

// Delete meetup.
router.put('/:id', Auth.verifyToken, updateMeetup);

// Fetch a specific meetup record.
router.get('/:id/questions/trending', Auth.verifyToken, getTrendingQuestions);

// Fetch a popular tags list.
router.get('/tags/popular', Auth.verifyToken, getPopularTags);

export default router;
