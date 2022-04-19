const appError = require('./class.handel.errors');
require('dotenv').config();

const handleJWTError = () =>
new appError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
new appError('Your token has expired! Please log in again.', 401);

function InvalidId(err) {
  const messae = `Invalid input path:${err.path}, value:${err.value}`
  return new appError(messae, 400);
}

function MongooseHandelErrors (err) {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data ${errors.join('. ')}`;
  return new appError(message , 400);
}

function DublicateData(error) {
  const value = Object.values(error.keyValue);
  const message = `${value} is already exits!!`;
  return new appError(message , 400);
}

function sendDevError (err , res) {
  return res.status(err.statusCode).json({
    status:err.status,
    message:err.message,
    error:err,
    stack : err.stack,
  })
}

function sendProdError(err ,res) {
  if(err.isOpertional) {
    return res.status(err.statusCode).json({
      status:err.status,
      message : err.message,
    })
  }
  console.log('ERROR', err);
  return res.status(500).json({
    message:'something went wrog',
  })
}

function handelErrorMiddleware(err , req , res, next) {
  err.status = err.status || 'fail';
  err.statusCode = err.statusCode || 500;
  if( process.env.NODE_ENV === 'development'){
    sendDevError(err , res);

  } else  if( process.env.NODE_ENV === 'production' ){

    if(err.code ===11000){
      err= DublicateData(err);
    }

  if(err.name ==='ValidationError'){
      err = MongooseHandelErrors(err)
    }         
    
  if(err.name==='CastError' && err.kind==='ObjectId') {
      err = InvalidId (err);
    }

   if (err.name === 'JsonWebTokenError') err = handleJWTError();
   if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();
   
   sendProdError(err ,res)
  }

}

module.exports = handelErrorMiddleware;