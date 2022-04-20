const appError = require('../../handelErros/class.handel.errors');

const {FindUser}  = require('../../models/user.models');
const {
  CreateBlock,
  FindBlock,
  unBlockUser,
  checkBlock,
  GetMyBlocks
} = require('../../models/block.models');



async function httpCreateBlock(req ,res ,next) {
 const {user_id} = req.params;
 const blockedUser = await FindUser({_id : user_id});
 if(!blockedUser){
   return next(new appError('User is not found'));
 }
 if( await checkBlock(req.user._id , user_id )){
  return next(new appError('You can not reach this page'))
 }
  const currentUserID = req.user._id
 

  await req.user.updateOne({$pull : {followers : blockedUser._id}})
  await req.user.updateOne({$pull: {followings: blockedUser._id}});
  await blockedUser.updateOne({$pull : {followers : currentUserID}})
  await blockedUser.updateOne({$pull: {followings: currentUserID }});


  await CreateBlock(req.user._id , user_id)
  return res.status(201).json({
    status:'success',
    message:`You blocked ${blockedUser.name}`
  })
 }


async function httpUnBlockUser(req ,res ,next) {
  const {user_id} = req.params;
  if(req.user._id === user_id){
    return next(new appError('You can not block your self'));
  }
  const user = await FindUser({_id : user_id});
  if(!user){
    return next(new appError('User is not found'));
  }
  const isBlocked = await FindBlock(req.user._id.toString() ,user_id);
  if(!isBlocked) {
   return next(new appError('You did not block this user to unblock it', 400))
  }

  await unBlockUser(isBlocked._id);  
  return res.status(200).json({
    status:'success',
    message:`You unblocked ${user.name}`
  })
}

async function httpGetMyBlocks(req ,res ,next) {
  const blocks = await GetMyBlocks({blockedBy: req.user._id});
  return res.status(200).json({
    status:'success',
    results: blocks.length,
    data: blocks
  })
}

module.exports={
  httpCreateBlock,
  httpUnBlockUser,
  httpGetMyBlocks
}