const express = require('express');
const likeRoute = express.Router();

const catchAsync = require('../../authController/catchAsync');
const authenticate = require('../../authController/authenticate');
const authorized = require('../../authController/authorized');

const {
  httpGetAllLikes,
  httpLikeDislikeComment
} = require('./like.comment.conrtoller');

likeRoute.use(catchAsync(authenticate));
likeRoute.use(authorized('user'))
likeRoute.get('/', catchAsync(httpGetAllLikes));
likeRoute.patch('/like/:commentId', catchAsync(httpLikeDislikeComment));

module.exports= likeRoute;