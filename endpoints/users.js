const express = require('express');
const database = require('../db_queries/users');

const router = express.Router();

const { users } = database;

module.exports = router;