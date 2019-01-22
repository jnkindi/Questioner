let rsvpsFetched = [];
let meetupsFetched = [];
try {
    meetupsFetched = require('../models/meetups.json');
} catch (err) {
    meetupsFetched = [];
}

if (typeof (meetupsFetched) !== 'object') {
    meetupsFetched = [];
}

try {
    rsvpsFetched = require('../models/rsvps.json');
} catch (err) {
    rsvpsFetched = [];
}

if (typeof (rsvpsFetched) !== 'object') {
    rsvpsFetched = [];
}

module.exports = {
    meetups: meetupsFetched,
    rsvps: rsvpsFetched
};