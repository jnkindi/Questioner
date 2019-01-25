<img src="https://jnkindi.github.io/Questioner/UI/images/logo-transparent.png" align="right" width= "30%"/>

# Questioner

> Crowd-source questions for a meetup

Questioner helps meetup organizer prioritize questions to be answered. Users can upvote or downvote on asked questions and they are set to the top or bottom of the list.

[![Build Status](https://travis-ci.org/jnkindi/Questioner.svg?branch=develop)](https://travis-ci.org/jnkindi/Questioner)   [![Maintainability](https://api.codeclimate.com/v1/badges/384a63f4eddd9d87d29e/maintainability)](https://codeclimate.com/github/jnkindi/Questioner/maintainability)   [![Test Coverage](https://api.codeclimate.com/v1/badges/384a63f4eddd9d87d29e/test_coverage)](https://codeclimate.com/github/jnkindi/Questioner/test_coverage)   [![Coverage Status](https://coveralls.io/repos/github/jnkindi/Questioner/badge.svg?branch=develop)](https://coveralls.io/github/jnkindi/Questioner?branch=develop)

# Documentation Content

* [UI](#ui)
    * [Tools used](#ui-tools-used)
    * [Product](#ui-product)

* [API](#api)
    * [Tools Used](#api-tools-used)
    * [Endpoints](#endpoints)
    * [Responses](#responses)
    * [Product](#api-product)
* [Getting started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installing](#installing)
    * [Run the server](#run-the-server)
    * [Run the test](#run-the-test)

* [Contributors](#contributors)
* [Copyright](#copyright)

## UI

This section provides guidelines on Questioner UI, the tools used for building it and also the final presentation of the product.


### UI Tools used

    HTML
    CSS
    Javascript

### UI Product
[Questioner App UI](https://jnkindi.github.io/Questioner/UI/html/index.html)


## API

This section provides guidelines and enpoints for Questioner APIs, that are used for sending and receiving information used in and by the Quesioner.


### API Tools used

#### Language

```
Javascript
```

#### Server Environment

```
 NodeJS (Run-time environment for running JS codes)
 ```

#### Framework

```
 Express
 ```

#### Testing Framework

```
 Mocha, Chai and Supertest
 ```

#### Style Guide

```
Airbnb
```

#### Continuous Integration

```
Travis CI
```

#### Maintainability

```
Code Climate
```

#### Test Coverage

```
nyc
```

#### Deployment

```
Heroku
```

### Endpoints

| Enpoint | Methods  | Description  |
| ------- | --- | --- |
| / | GET | The index |
| /api/v1/auth/signup | POST | Create new account |
| /api/v1/auth/login | POST | User login |
| /api/v1/meetups | POST | Recording a new meetup |
| /api/v1/meetups | GET | Fetch all meetups |
| /api/v1/meetups/upcoming | GET | Fetch all upcoming meetups |
| /api/v1/meetups/:id | GET | Fetch a specific meetup information |
| /api/v1/meetups/:id/rsvps | POST | RSVP a meetup |
| /api/v1/meetups/:id | DELETE | Delete a meetup |
| /api/v1/meetups/:id/questions | POST | Add a new question on meetup 
| /api/v1/meetups/:id/questions | GET | Fetch all meetup questions  |
| /api/v1/meetups/search/?topic=:topic | GET | Searches all meetup by topic  
| /api/v1/meetups/:id/images | POST | Add a new images on question |
| /api/v1/meetups/:id/images | DELETE | Delete image on question |
| /api/v1/meetups/:id/tags | POST | Add a new tags on question |
| /api/v1/meetups/:id/tags | DELETE | Delete tag on question |
| /api/v1/meetups/:id | PUT | Updates meetup |
| /api/v1/meetups/:id/questions/trending | GET | Fetches trending question on meetup |
| /api/v1/questions/:id/upvote | PATCH | Upvote on a meetup question |
| /api/v1/questions/:id/downvote  | PATCH | Downvote on a meetup question |
| /api/v1/questions/:id  | PUT | Update meetup information |
| /api/v1/questions/:id/comments  | POST | Adds comment on question |
| /api/v1/questions/:id/comments  | GET | Fetch all comment on question |
| /api/v1/questions/:id/comments/:commentid  | PUT | Update comment on question |
| /api/v1/users/:id  | PUT | Update user information |
| /api/v1/users/:id  | DELETE | Delete user information |
| /api/v1/users/:id  | GET | Fetch user information |

### Responses

#### On success

>{ "status": 200, "data": [ { ... }] }
​
#### On error

>{ "status": 400, "error": "relevant-error-message" }
​

The status codes above are provided as samples, and by no way specify that all success
reponses should have ​ 200​​ or all error responses should have ​ 400.

### API Product

[Questioner API (Hosted on Heroku)](https://jnkindi-questioner-app.herokuapp.com)

## Getting started

These instructions will get you a copy of the project up and running on your local machine or server for development and testing purposes. Here are deployment notes on how to deploy the project on a live system.


### Prerequisites

To install the software on your local machine or server, you need first to clone the repository or download the zip file and once this is set up you are going to need to install NodeJS.


### Installing

The installation of this application is fairly straightforward, After cloning this repository to your local machine,CD into the package folder using your terminal and run the following

```
> npm install
```

It will install the node_modules which will help you run the project on your local machine.

#### Run the server

```
> npm start
```

#### Run the test

```
> npm test
```

## Contributors

- NYILINKINDI Munezero Jean Jacques


## Copyright

&copy; NYILINKINDI Munezero Jean Jacques, Developer