const appError = require('../../handelErros/class.handel.errors');

const {
  CreatePost,
  GetSinglePost,
  GetAllPost,
  UpdatePost,
  DeletePost,
  FindUser,
} =require('../../models/post.models');
const {checkPermessions} = require('../../services/query')

async function httpGetAllPost (req ,res ,next) {
  const posts = await GetAllPost();
  return res.status(200).json({
    status:'success',
    resulta:posts.length,
    data: posts
  })
}

async function httpGetSinglePost (req ,res ,next) {
  const {id} = req.params;
  const post = await GetSinglePost({
    _id: id
  })
  if(!post) {
    return next(new appError ('post is not extis'));
  }
  return res.status(200).json({
    status:'success',
    post
  })
}



async function httpCreatePost (req ,res ,next) {
  const post = await CreatePost(req);
  return res.status(201).json({
    status:'success',
    post
  })
}


async function httpUpdatePost (req ,res ,next) {
  const {id} = req.params;
  let post = await GetSinglePost({_id : id});
  if(!post) {
    return next(new appError ('post is not extis')); 
  } 
  const user = await FindUser({
    _id : id,
    user: req.user._id
  })
  if(!user) {
    return next(new appError('You are not authorized to do this action',400))
  }
  post = await UpdatePost(req.body , id);
  return res.status(200).json({
    status:'success',
    post
  })
}


async function httpDeletePost (req ,res ,next) {
 
  const {id} = req.params;
  const post = await GetSinglePost({_id : id});
  if(!post) {
    return next(new appError ('post is not extis')); 
  }
 
  if(!checkPermessions(req.user , post.user)){
    return next(new appError('You are not authorized to do this action',400))
  }
  await post.remove();
  return res.status(200).json({
    status:'success',
  })
}


async function httpLikeDislikePost(req ,res ,next){
  const {id} = req.params;
  let message;
  const post = await GetSinglePost({_id: id});
  if(!post){
    return next(new appError('Post is not exits'));
  }

  if(!post.likes.includes(req.user._id)) {
    await post.updateOne({$push: {likes: req.user._id}});
    message='You liked it'
  }else {
    await post.updateOne({$pull: {likes: req.user._id}});
    message='You removed your like'
  }
  return res.status(200).json({
    status:'success',
    message,
  })
}

module.exports = {
  httpCreatePost,
  httpDeletePost,
  httpGetAllPost,
  httpGetSinglePost,
  httpUpdatePost,
  httpLikeDislikePost,
}