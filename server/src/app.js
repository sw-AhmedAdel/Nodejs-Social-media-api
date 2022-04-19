const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const handelErrorMiddleware = require('./handelErros/handel.middlware.error');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const api = require('./routes/api');
const appError = require('./handelErros/class.handel.errors');

const limiter = rateLimit({
  max: 100 ,
  windowMs: 60 * 60 * 1000, 
  message:'To many requests from this api/ please try again an hour'
})
app.use(limiter) 
app.use(helmet()); 
app.use(mongoSanitize());
app.use(xss());

app.use(hpp({ // 
  whitelist:['artist,name']
}))

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET)); 
app.use(express.json());


app.use('/v1', api);
app.all('*', (req , res ,next) => { 
  return next(new appError(`could not find ${req.originalUrl} on this server`, 404));
})

app.use(handelErrorMiddleware);

module.exports= app;