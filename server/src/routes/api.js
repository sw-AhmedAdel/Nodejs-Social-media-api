const express = require('express');
const api = express.Router();
const userRoute = require('./user/user.route');
const postRoute = require('./post/post..route');
const blockRoute = require('./block/block.route');

api.use('/blocks',blockRoute)
api.use('/posts', postRoute)
api.use('/users', userRoute);

module.exports = api;