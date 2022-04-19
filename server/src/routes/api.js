const express = require('express');
const api = express.Router();
const userRoute = require('./user/user.route');

api.use('/users', userRoute);

module.exports = api;