const crypto = require('crypto');
const appError = require('../handelErros/class.handel.errors');
const email = require('../services/email');
const sendCookieVieRespond = require('../authController/cookie');
const {
  FindUser
} = require('../models/user.models');

async function httpForgotPassword (req ,res ,next) {
  if(!req.body.email) {
    return next(new appError('please provide your emai' , 400));
  }
  const user = await FindUser({
    email : req.body.email
  })

  if(!user) {
    return next(new appError('this user is not exits' , 404));
  }

  try{
    const resetToken = await user.createpasswordResetToken();
    const url = `${req.protocol}://${req.get('host')}/v1/forgotpassword/${resetToken}`;
    await new email(user, url).sendPasswordreset();
    return res.status(200).json({
      status:'success',
      message:'Token send to email'
    })
  }catch(err) {
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
    await user.save();
    return next(new appError('there was an error sending the email, please try again later'));
  }
}


async function httpResetPassword(req , res ,next) {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await FindUser({
    passwordResetToken: hashedToken,
    passwordResetToken: {
      $gt: Date.now()
    }
  }) 

  if(!user) {
    return next(new appError('Invalid token or token is expired', 400));
  }
 
  if(!req.body.password || !req.body.passwordConfirm) {
    return  next(new appError('Password and confirm password must be provided', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm =req.body.passwordConfirm;
  user.passwordResetToken=undefined;
  user.passwordResetExpires = undefined;  
  await user.save();
  sendCookieVieRespond(user , res);
  return res.status(200).json({
    status:'success',
  })

}


async function httpUpdatePassword (req ,res ,next) {
  const user = req.user;

  if(!req.body.currentpassword || !req.body.password || !req.body.passwordConfirm ) {
    return next(new appError('Please enter your password and new password and confirm password', 400));
  }
  if(!await user.comparePassword(req.body.currentpassword , user.password)){
    return next (new appError('Your current password is wrong', 401));// unauthorized
  }
  
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  sendCookieVieRespond(user , res);
  return res.status(200).json({
    status:'success',
    message:'You updated your password'
  })
}

module.exports = {
  httpForgotPassword,
  httpResetPassword,
  httpUpdatePassword
}