const appError = require('../../handelErros/class.handel.errors');
const {
  CreateLike,
  GetAllLikes,
  FindMyLike,
  DeleteMyLike
} =require('../../models/like.comment.models');
const {
  GetSingleComment
} = require('../../models/comment.models');


async function httpLikeDislikeComment (req ,res ,next){
  const {commentId} = req.params;
  const comment = await GetSingleComment({_id : commentId});
  if(!comment){
    return next(new appError('Comment is not found'));
  }
  // here comment is there so i need to check if i liked it ? if i did it i will remove it
  //if i am not ? i will add it
  let like = await FindMyLike({
    user: req.user._id,
    comment : commentId
  });

  if(!like){
    // create new like
    like = await CreateLike(req.user._id , commentId);
    return res.status(200).json({
      status:'Like has been added',
      like
    }) 
  }
  await DeleteMyLike(like._id);
  return res.status(200).json({
    status:'Like has been removed'
  })
}

async function httpGetAllLikes(req ,res ,next){
  const likes = await GetAllLikes();
  return res.status(200).json({
    satus:'success',
    data: likes
  })
}

module.exports= {
  httpGetAllLikes,
  httpLikeDislikeComment
}