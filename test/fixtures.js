const meetup_post = {
    "location": "Test Telecom House, Kigali",
    "images": [
        "https://jnkindi.github.io/Questioner/UI/images/slider-1.png",
        "https://jnkindi.github.io/Questioner/UI/images/slider-2.png",
        "https://jnkindi.github.io/Questioner/UI/images/slider-2.png"],
    "topic": "Test Fellowship Talks",
    "description": "We shall talk about everything on fellowship and how to get started",
    "happeningOn": "01-01-2019",
    "tags": ["Andela", "Fellowship", "jgjj"]
};

const question_post = {
    "createdBy": 5,
    "meetup": 3,
    "title": "Test Fellowship Talks",
    "body": "We shall talk about everything on fellowship and how to get started"
};

const rsvp_post = {
	"meetup": 1,
	"user": 1,
	"response": "maybe"
};

const user_post = {
	"firstname": "TEST Jacques",
    "lastname": "Nyilinkindi",
    "othername": "Munezero Jean",
    "email": "jack@u.com",
    "phoneNumber": "078887878",
    "username": "j_nkindi",
    "password": "12345678",
    "isAdmin": false
};

module.exports = {
    meetup_post,
    question_post,
    rsvp_post,
    user_post
}