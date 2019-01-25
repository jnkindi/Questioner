import { Pool } from 'pg';
import ENV from 'dotenv';

ENV.config();

class Setup {
    constructor() {
        this.pool = new Pool({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT,
        });

        this.pool.on('connect', () => {
            console.log('connected...');
        });

        this.createTables();
    }

    createTables() {
        const meetups = `
        CREATE TABLE IF NOT EXISTS meetups (
            id SERIAL PRIMARY KEY,
            createdon date,
            location text,
            images text[],
            topic text,
            description text,
            happeningon date,
            tags text[]
        );`;

        this.pool.query(meetups)
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.log(error.message);
        });

        const questionVoters = `
        CREATE TABLE IF NOT EXISTS questionvoters (
            id SERIAL PRIMARY KEY,
            userid integer,
            questionid integer,
            votetype text
        );`;

        this.pool.query(questionVoters)
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.log(error.message);
        });

        const questioncomments = `
        CREATE TABLE IF NOT EXISTS questioncomments (
            id SERIAL PRIMARY KEY,
            questionid integer,
            userid integer,
            comment text,
            createdon date
        );`;

        this.pool.query(questioncomments)
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.log(error.message);
        });

        const questions = `
        CREATE TABLE IF NOT EXISTS questions (
            id SERIAL PRIMARY KEY,
            createdon date,
            createdby integer,
            meetupid integer,
            title text,
            body text,
            upvotes integer,
            downvotes integer
        );`;

        this.pool.query(questions)
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.log(error.message);
        });

        const rsvps = `
        CREATE TABLE IF NOT EXISTS rsvps (
            id SERIAL PRIMARY KEY,
            meetupid integer,
            userid integer,
            response text
        );`;

        this.pool.query(rsvps)
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.log(error.message);
        });

        const users = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            firstname text,
            lastname text,
            othername text,
            email text,
            phonenumber text,
            username text,
            password text,
            registered date,
            isadmin boolean
        );`;

        this.pool.query(users)
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.log(error.message);
        });
    }
}

export default new Setup();
