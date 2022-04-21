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
  httpMyProfile,
  httpDeleteUserbyAdmin,
  httpFollowUser,
  httpUnFollowUser,
  httpGetMyFollowers,
  httpGetMyFollowings,
  uploadUsersImages,
  resizeUsersImages
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
userRoute.get('/me' , authorized('user') , catchAsync(httpMyProfile));
userRoute.get('/get/user/:userid' , authorized('user') ,catchAsync( httpGetSingleUser));
userRoute.patch('/updateme' ,authorized('user') , uploadUsersImages, catchAsync(resizeUsersImages) ,catchAsync( httpUpdateUser));
userRoute.patch('/update/my/password', authorized('user') ,catchAsync(httpUpdatePassword));
userRoute.delete('/deleteme' , authorized('user') , catchAsync(httpDeleteUser));
userRoute.get('/logout' ,authorized('user') ,catchAsync( httpLogout));

userRoute.patch('/follow/:userid' , authorized('user') , catchAsync(httpFollowUser));
userRoute.patch('/unfollow/:userid' , authorized('user') , catchAsync(httpUnFollowUser));
userRoute.get('/myfollowers' , authorized('user') , catchAsync(httpGetMyFollowers));
userRoute.get('/myfollowings' ,  authorized('user') ,catchAsync(httpGetMyFollowings));


userRoute.delete('/delete/user/:userid',authorized('admin') , catchAsync(httpDeleteUserbyAdmin) )
userRoute.get('/', authorized('admin') ,catchAsync( httpGetALlUsers));
module.exports = userRoute;


