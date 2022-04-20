const express = require('express');
const api = express.Router();
const userRoute = require('./user/user.route');
const postRoute = require('./post/post..route');
const blockRoute = require('./block/block.route');
const commentRoute = require('./comment/comment.route');
const likeRoute = require('./likeComments/like.comment..route');

api.use('/likecomments',likeRoute)
api.use('/comments', commentRoute);
api.use('/blocks',blockRoute)
api.use('/posts', postRoute)
api.use('/users', userRoute);

module.exports = api;