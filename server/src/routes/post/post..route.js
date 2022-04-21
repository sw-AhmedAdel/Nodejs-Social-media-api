
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
  httpGetMyPostsAndMyfollowingsPost,
  httpGetMyPosts,
  httpSharePost,
  httpGetUserPosts
} = require('./post..controller');


postRoute.use(catchAsync(authenticate));
postRoute.use(authorized('user'))
postRoute.get('/get/:id' , catchAsync(httpGetSinglePost));

postRoute.post('/' , catchAsync(httpCreatePost));
postRoute.get('/userposts/:userId', catchAsync(httpGetUserPosts) )
postRoute.delete('/delete/:id' , catchAsync(httpDeletePost));
postRoute.patch('/update/:id',catchAsync(httpUpdatePost));
postRoute.patch('/like/:id', catchAsync(httpLikeDislikePost));
postRoute.get('/home', catchAsync(httpGetMyPostsAndMyfollowingsPost))
postRoute.get('/myposts', catchAsync(httpGetMyPosts));
postRoute.post('/share/:postId', catchAsync(httpSharePost) )

//use it for resting
postRoute.get('/' ,catchAsync(httpGetAllPost ));

module.exports = postRoute;
