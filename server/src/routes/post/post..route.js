
const express = require('express');
const postRoute = express.Router();

const catchAsync = require('../../authController/catchAsync');
const authenticate = require('../../authController/authenticate');
const authorized = require('../../authController/authorized');

const {
  httpCreatePost,
  httpDeletePost,
  httpGetAllPost,
  httpGetSinglePost,
  httpUpdatePost,
  httpLikeDislikePost,
  httpGetMyPostsAndMyfollowingsPost
} = require('./post..controller');


postRoute.use(catchAsync(authenticate));
postRoute.get('/get/:id' , catchAsync(httpGetSinglePost));

postRoute.post('/' , catchAsync(httpCreatePost));
postRoute.delete('/delete/:id' , catchAsync(httpDeletePost));
postRoute.patch('/update/:id',catchAsync(httpUpdatePost));
postRoute.patch('/like/:id', catchAsync(httpLikeDislikePost));
postRoute.get('/home', catchAsync(httpGetMyPostsAndMyfollowingsPost))
//postRoute.use(authorized('admin'));
postRoute.get('/' , catchAsync(httpGetAllPost ));

module.exports = postRoute;
