const appError = require('../../handelErros/class.handel.errors');
const {checkPermessions ,
      checkExtraPermessions} = require('../../services/query')

const {
  CreateComment,
  GetSingleComment,
  GetAllComment,
  UpdateComment,
  DeleteComment,
} = require('../../models/comment.models');
const {GetSinglePost} = require('../../models/post.models')

async function httpGetAllComment (req ,res ,next) {
  const comments = await GetAllComment();
  return res.status(200).json({
    status:'success',
    resulta:comments.length,
    data: comments
  })
}

async function httpGetSingleComment (req ,res ,next) {
  const {id} = req.params;
  const comments = await GetSingleComment({
    _id: id
  })
  if(!comments) {
    return next(new appError ('Comment is not extis'));
  }
  return res.status(200).json({
    status:'success',
    comments
  })
}



async function httpCreateComment (req ,res ,next) {
  //get the post id and user id
  const userId = req.user._id;
  const { postId } = req.params
  const post = await GetSinglePost({_id : postId});
  if(!post){
    return next(new appError('Post is not found'))
  }
  const comment = await CreateComment( req ,userId , postId);
  return res.status(201).json({
    status:'success',
    comment
  })
}


async function httpUpdateComment (req ,res ,next) {
  const {id} = req.params;
  let comment = await GetSingleComment({_id : id});
  if(!comment) {
    return next(new appError ('Comment is not extis')); 
  } 
  const user = await GetSingleComment({
    _id : id,
    user: req.user._id
  })
  if(!user) {
    return next(new appError('You are not authorized to do this action',400))
  }
  comment = await UpdateComment(req.body , id);
  return res.status(200).json({
    status:'success',
    comment
  })
}


async function httpDeleteComment (req ,res ,next) {
 // user can delete the comment
 //admin can delete the comment
 // user that has the post can delete the comment on it

  const {id} = req.params;
  const Comment = await GetSingleComment({_id : id});
  if(!Comment) {
    return next(new appError ('Comment is not extis')); 
  }
 
  // check if this user owns this comment to delete it or it is admin
  if(! await checkExtraPermessions(req.user , Comment)){
    return next(new appError('You are not authorized to do this action',400))
  }

  await DeleteComment(id);
  return res.status(200).json({
    status:'success',
  })
}

module.exports = {
  httpCreateComment,
  httpDeleteComment,
  httpGetAllComment,
  httpGetSingleComment,
  httpUpdateComment,

}