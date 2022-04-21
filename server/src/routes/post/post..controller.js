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
const {GetAllComment} = require('../../models/comment.models');
const {DeleteManyLikes}= require('../../models/like.comment.models');
const {DeleteManycomments} = require('../../models/comment.models');
const {checkBlock} =require('../../models/block.models')


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
    return next(new appError ('post is not extis' ,400));
  }

  if( await checkBlock(post.user , req.user._id )){
    return next(new appError('You can not reach this page',400))
   }

  return res.status(200).json({
    status:'success',
    post
  })
}



async function httpCreatePost (req ,res ,next) {
  const getPost= {
    ...req.body,
    user: req.user._id
  } 
  const post = await CreatePost(getPost);
  return res.status(201).json({
    status:'success',
    post
  })
}


async function httpUpdatePost (req ,res ,next) {
  const {id} = req.params;
  let post = await GetSinglePost({_id : id});
  if(!post) {
    return next(new appError ('post is not extis',400)); 
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
    return next(new appError ('post is not extis',400)); 
  }
 
  if(!checkPermessions(req.user , post.user)){
    return next(new appError('You are not authorized to do this action',400))
  }

  const comments = await GetAllComment({post : post._id});
  await Promise.all(
    comments.map( async (comment) => {
     await DeleteManyLikes({comment: comment._id})
    })
  )

  await DeleteManycomments({post : post._id })
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
    return next(new appError('Post is not exits',400));
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

async function httpGetMyPostsAndMyfollowingsPost(req ,res ,next){
  const user = req.user;
  let allPosts =[];
  const myPosts= await GetAllPost({user : user._id });
  
  const followingsPost = await Promise.all(
    // if i want to use any loop i should use promise.all
    // why use promise all coz i want to get an array that has all post and usee map for it 
    //so i want to use map inside promise all so i can make it asyn and after that user await
    user.followings.map((friendId) =>{
      //iterate over each freind and get his posts
     return GetAllPost({user :friendId })
    })
  )
  allPosts= [...myPosts , ...followingsPost]
  //myPosts.concat(...followingsPost)
 
  return res.status(200).json({
    status:'success',
    data:allPosts,
  })
}


async function httpGetMyPosts (req ,res ,next) {
  const user = req.user;
  const myPosts= await GetAllPost({user : user._id });
  return res.status(200).json({
    status:'success',
    results:myPosts.length,
    data:myPosts,
  })
}

async function httpSharePost (req ,res ,next) {
  const {postId} = req.params;
  let post = await GetSinglePost({_id :postId });
  if(!post){
    return next(new appError('Post is not found',400))
  }

  if( await checkBlock(post.user , req.user._id )){
    return next(new appError('You can not reach this page',400))
   }
   const newPost = {
    isShared: post._id,
    sharedFrom:post.user,
    desc:post.desc,
    image:post.image,
    user: req.user._id
   }
   post = await CreatePost(newPost);
   return res.status(201).json({
     status:'Shared post',
     data:post
   })

}

module.exports = {
  httpCreatePost,
  httpDeletePost,
  httpGetAllPost,
  httpGetSinglePost,
  httpUpdatePost,
  httpLikeDislikePost,
  httpGetMyPostsAndMyfollowingsPost,
  httpGetMyPosts,
  httpSharePost
}