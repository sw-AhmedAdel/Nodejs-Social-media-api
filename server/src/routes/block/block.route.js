const express = require('express');
const blockRoute = express.Router();

const catchAsync = require('../../authController/catchAsync');
const authenticate = require('../../authController/authenticate');
const authorized = require('../../authController/authorized');

const {
  httpCreateBlock,
  httpUnBlockUser,
  httpGetMyBlocks
} = require('./block.controller');

blockRoute.use(catchAsync(authenticate));
blockRoute.post('/block/:user_id', catchAsync(httpCreateBlock));
blockRoute.delete('/unblock/:user_id', catchAsync(httpUnBlockUser));
blockRoute.get('/', catchAsync(httpGetMyBlocks));

module.exports= blockRoute;


