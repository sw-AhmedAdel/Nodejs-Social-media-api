const LikeComment = require('./like.comment.mongo');


//get user id and comment id
async function CreateLike (user, comment){
  const newLike = new LikeComment({
    user, 
    comment
  })
  await newLike.save();
  return newLike
}

async function GetAllLikes(filter){
  return await LikeComment.find(filter)
}

async function FindMyLike(filter){
  return await LikeComment.findOne(filter)
}

async function DeleteMyLike(id){
  await LikeComment.findByIdAndDelete(id)
}

async function DeleteManyLikes(filter){
  await LikeComment.deleteMany(filter)
}

module.exports= {
  CreateLike,
  GetAllLikes,
  FindMyLike,
  DeleteMyLike,
  DeleteManyLikes
}