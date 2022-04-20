const {
  CreateUser,
  FindUser,
  UpdateUser,
  DeleteUser,
  GetALlUsers,
  findByrCedenitals,
  
} = require('../../models/user.models');
const sendCookieVieRespond = require('../../authController/cookie');
const appError = require('../../handelErros/class.handel.errors');
const {checkPermessions} = require('../../services/query')
const {filterData} = require('../../services/query')
const {checkBlock} = require('../../models/block.models');
const app = require('../../app');
 
async function httpMyProfile (req ,res ,next) {
  return res.status(200).json({
    status:'success',
    data:req.user
  })
}

async function httpCreateUser (req ,res ,next) {
 
  const user = req.body;
  const newUser = await CreateUser(user);
  sendCookieVieRespond(newUser, res);
  return res.status(201).json({
    status:'success',
    data: newUser,
  })
}

async function httpLoginUser (req ,res ,next) {
  const {email , password} = req.body;
 
  if(!email || !password) {
    return next(new appError('Email and password must be provided'))
  }
  const user = await findByrCedenitals(email , password);
  if(!user) {
    return next(new appError('Unable to login', 401));
  }
  sendCookieVieRespond(user , res);

  return res.status(201).json({
  
    status:'success',
    data : user,
  })
}

async function httpGetALlUsers(req ,res ,next) {
  const users = await GetALlUsers();
  return res.status(200).json({
    status:'success',
    data : users
  });
}

async function httpGetSingleUser(req ,res ,next) {
  const {userid} = req.params;
  const user = await FindUser({
    _id : userid
  })
  if(!user) {
    return next(new appError('User is not found', 404))
  }

 if( await checkBlock(req.user._id , userid )){
  return next(new appError('You can not reach this page'))
 }
  return res.status(200).json({
    status:'success',
    data : user
  })
}


async function httpUpdateUser(req ,res ,next) {
  if(req.body.password || req.body.passwordConfirm) {
    return next(new appError('please update password from v1/users/updatepassword', 400));
   }
  
  const userid = req.user._id;
  const filter = filterData(req.body , 'name','email');
  const user = await UpdateUser(filter , userid);
  return res.status(200).json({
    status:'success',
    data : user,
  })
}

async function httpDeleteUser (req ,res ,next) {
  const userid = req.user._id;
  await DeleteUser(userid);
  return res.status(200).json({
    status:'success',
    message:'You deleted your account'
  })
}


async function httpDeleteUserbyAdmin (req ,res ,next) {
  const {userid} = req.params;
  const user = await FindUser({
    id: userid
  })
  if(!user) {
    return next (new appError('No user was found'))
  }
  await DeleteUser(userid);
  return res.status(200).json({
    status:'success',
    message:'this account has been deleted'
  })
}


function httpLogout(req , res ) {
  res.cookie('token' , 'Logout', {
    httpOnly : true,
    expires: new Date(Date.now())
  })
  if( process.env.NODE_ENV === 'development'){
    return res.status(200).json({
      status:'success',
      messae:'You loged out'
    })
   } 
}

 

async function httpFollowUser (req ,res ,next) {
  const {userid} = req.params;

  if(req.user._id.toString() === userid){
    return next(new appError('You can not follow yourself'))
  }
 
  if( await checkBlock(req.user._id , userid )){
    return next(new appError('You can not reach this page'))
   }

  const FollowThisUser = await FindUser({_id : userid});
  if(!httpFollowUser) {
    return next(new appError('This user is not found'))
  }
  if(FollowThisUser.followers.includes(req.user._id)) {
    return next(new appError('You already follow this user'))
  }
  await req.user.updateOne({$push: {followings: FollowThisUser._id}});
  await FollowThisUser.updateOne({$push: {followers: req.user._id}});
  return res.status(200).json({
    status:'success',
    message:'User has been followed'
  })

}


async function httpUnFollowUser (req ,res ,next) {
  const {userid} = req.params;
  if(req.user._id.toString() === userid){
    return next(new appError('You can not unfollow yourself'))
  }

  if( await checkBlock(req.user._id , userid )){
   return next(new appError('You can not reach this page'))
   }

  const unFollowThisUser = await FindUser({_id : userid});
  if(!unFollowThisUser) {
    return next(new appError('This user is not found'))
  }
  if(!unFollowThisUser.followers.includes(req.user._id)) {
    return next(new appError('You already unfollowed this user'))
  }
  await req.user.updateOne({$pull: {followings: unFollowThisUser._id}});
  await unFollowThisUser.updateOne({$pull: {followers: req.user._id}});
  return res.status(200).json({
    status:'success',
    message:'User has been unfollowed'
  })
}

async function httpGetMyFollowers (req ,res ,next) {
 
  const followers = await GetALlUsers({_id: req.user.followers})
  return res.status(200).json({
    status:'success',
    results:followers.length,
    data:followers
  })
}
async function httpGetMyFollowings (req ,res ,next) {
  

  const followings = await GetALlUsers({_id: req.user.followings})
  return res.status(200).json({
    status:'success',
    results:followings.length,
    data:followings
  })
}


module.exports = {
  httpMyProfile,
  httpCreateUser,
  httpDeleteUser,
  httpGetALlUsers,
  httpLogout,
  httpGetSingleUser,
  httpUpdateUser,
  httpLoginUser,
  httpDeleteUserbyAdmin,
  httpFollowUser,
  httpUnFollowUser,
  httpGetMyFollowers,
  httpGetMyFollowings
}