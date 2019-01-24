const meetupPost = {
    location: 'Test Telecom House, Kigali',
    images: [
        'https://jnkindi.github.io/Questioner/UI/images/slider-1.png',
        'https://jnkindi.github.io/Questioner/UI/images/slider-2.png',
        'https://jnkindi.github.io/Questioner/UI/images/slider-2.png',
    ],
    topic: 'Test Fellowship Talks',
    description: 'We shall talk about everything on fellowship and how to get started',
    happeningOn: '01-01-2019',
    tags: ['Andela', 'Fellowship', 'jgjj'],
};

const questionPost = {
    createdBy: 5,
    title: 'Test Fellowship Talks',
    body: 'We shall talk about everything on fellowship and how to get started',
};

const rsvpPost = {
    meetup: 1,
    user: 1,
    response: 'maybe',
};

const userPost = {
    firstname: 'TEST Jacques',
    lastname: 'Nyilinkindi',
    othername: 'Munezero Jean',
    email: 'jack@u.com',
    phoneNumber: '078887878',
    username: 'j_nkindi',
    password: '12345678',
    isAdmin: false,
};

const userLoginInvalid = {
    username: 'Jac',
    password: 'Nyilinkindi',
};

const userLogin = {
    username: userPost.username,
    password: userPost.password,
};

export {
    meetupPost,
    questionPost,
    rsvpPost,
    userPost,
    userLogin,
    userLoginInvalid,
};
