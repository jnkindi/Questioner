
import meetupsList from '../models/meetups.json';
import rsvpsList from '../models/rsvps.json';

const meetups = ((typeof (meetupsList) !== 'object') ? [] : meetupsList);
const rsvps = ((typeof (rsvpsList) !== 'object') ? [] : rsvpsList);

export {
    meetups,
    rsvps
};