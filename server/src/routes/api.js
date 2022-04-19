const express = require('express');
const api = express.Router();
const userRoute = require('./user/user.route');
const postRoute = require('./post/post..route');

api.use('/posts', postRoute)
api.use('/users', userRoute);

module.exports = api;