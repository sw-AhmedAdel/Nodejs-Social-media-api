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
const {filterData} = require('../../services/query')
const {checkBlock} = require('../../models/block.models');

const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();
const multerFilter = (req , file , cb) => {
  if(file.mimetype.startsWith('image')) 
  {
    cb(null , true);
  }else {
    cb(new appError ('Not an image! please upload only images', 400 ) , false);
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
})

const uploadUsersImages = upload.fields([
  {name: 'profilePic' , maxCount: 1},
  {name :'coverPic' , maxCount: 1},
])


const resizeUsersImages =async (req , res ,next) => {
  if(req.files.coverPic) {
    
    req.body.imageCover =`user-${req.user._id}-${Date.now()}.jpeg`
    await sharp(req.files.imageCover[0].buffer)
    .resize({width:2000 , height:1333})
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`public/images/users/${req.body.coverPic}`)
  }

  if( req.files.coverPic) {

   req.body.coverPic =`user-${req.user._id}-${Date.now()}.jpeg`
    await sharp(req.files.coverPic[0].buffer)
    .resize({width:300 , height:300})
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`public/images/users/${req.body.coverPic}`)
  }

   next();
}
 
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
    return next(new appError('Email and password must be provided',400))
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

async function httpSearchUSerByName(req ,res ,next) {
  const {name} = req.query;
  const user = await FindUser({name:name})
  if(!user) {
    return next(new appError('User is not exits',400));
  }
  if(await checkBlock(user._id , req.user._id )){
    return next(new appError('You can not reach this page',400))
   }
   return res.status(200).json({
     status:'success',
     data:user
   })
}

// this is for testing
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
  return next(new appError('You can not reach this page',400))
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
    return next(new appError('You can not reach this page',400))
   }

  const FollowThisUser = await FindUser({_id : userid});
  if(!httpFollowUser) {
    return next(new appError('This user is not found',400))
  }
  if(FollowThisUser.followers.includes(req.user._id)) {
    return next(new appError('You already follow this user',400))
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
    return next(new appError('You can not unfollow yourself',400))
  }

  if( await checkBlock(req.user._id , userid )){
   return next(new appError('You can not reach this page',400))
   }

  const unFollowThisUser = await FindUser({_id : userid});
  if(!unFollowThisUser) {
    return next(new appError('This user is not found',400))
  }
  if(!unFollowThisUser.followers.includes(req.user._id)) {
    return next(new appError('You already unfollowed this user',400))
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
  httpSearchUSerByName,
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
  httpGetMyFollowings,
  uploadUsersImages,
  resizeUsersImages
}