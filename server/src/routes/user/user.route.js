const express = require('express');
const userRoute = express.Router();

const catchAsync = require('../../authController/catchAsync');
const authenticate = require('../../authController/authenticate');
const authorized = require('../../authController/authorized');

const {
  httpCreateUser,
  httpDeleteUser,
  httpGetALlUsers,
  httpLogout,
  httpGetSingleUser,
  httpUpdateUser,
  httpLoginUser,
  httpGetUserStats,
  httpMyProfile,
  httpDeleteUserbyAdmin,
  httpFollowUser,
  httpUnFollowUser
} = require('./user.controller');

const {
  httpForgotPassword,
  httpResetPassword,
  httpUpdatePassword
} = require('../../password/password');


userRoute.post('/signup' , catchAsync( httpCreateUser));
userRoute.post('/login' , catchAsync(httpLoginUser));
userRoute.post('/forgotpassword' ,  catchAsync(httpForgotPassword));
userRoute.patch('/resetpassword/:token' , catchAsync(httpResetPassword));

userRoute.use(catchAsync(authenticate))
userRoute.get('/me' ,  catchAsync(httpMyProfile));
userRoute.get('/get/user/:userid' , catchAsync( httpGetSingleUser));
userRoute.patch('/updateme' , catchAsync( httpUpdateUser));
userRoute.patch('/update/my/password', catchAsync(httpUpdatePassword));
userRoute.delete('/deleteme' ,  catchAsync(httpDeleteUser));
userRoute.get('/logout' ,catchAsync( httpLogout));

userRoute.patch('/follow/:userid' ,  catchAsync(httpFollowUser));
userRoute.patch('/unfollow/:userid' ,  catchAsync(httpUnFollowUser));

userRoute.get('/', catchAsync( httpGetALlUsers));
userRoute.use(authorized('admin'))

userRoute.get('/stats/:year', catchAsync(httpGetUserStats));
userRoute.delete('/delete/user/:userid', catchAsync(httpDeleteUserbyAdmin) )
module.exports = userRoute;


