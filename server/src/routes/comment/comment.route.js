const express = require('express');
const commentRoute = express.Router();

const catchAsync = require('../../authController/catchAsync');
const authenticate = require('../../authController/authenticate');
const authorized = require('../../authController/authorized');

const {
  httpCreateComment,
  httpDeleteComment,
  httpGetAllComment,
  httpGetSingleComment ,
  httpUpdateComment ,
} = require('./comment.controller');


commentRoute.use(catchAsync(authenticate));
commentRoute.use(authorized('user'))
commentRoute.get('/get/:id' , catchAsync(httpGetSingleComment  ));
commentRoute.post ('/comment/:postId' , catchAsync(httpCreateComment ));
commentRoute.delete('/delete/:id' , catchAsync(httpDeleteComment ));
commentRoute.patch('/update/:id',catchAsync(httpUpdateComment ));

//commentRoute.use(authorized('admin'));
//commentRoute.get('/' , catchAsync(httpGetAllComment  ));

module.exports = commentRoute;