const Comment = require('./comment.mongo');

async function CreateComment( req,user, post) {
  const newComment = new Comment({
    ...req.body,
    user, 
    post,
  });
  await newComment.save();
  return newComment;
}

async function GetAllComment(filter) {
  return await Comment.find(filter)
}

async function GetSingleComment(filter) {
  return await Comment.findOne(filter);
}


async function UpdateComment(editComment, id) {
  const comment= await Comment.findByIdAndUpdate(id , editComment, {
    new:true,
    runValidators:true,
  })
  return comment;
}

async function DeleteComment(id) {
  await Comment.findByIdAndDelete (id);
}


module.exports = {
  CreateComment,
  GetSingleComment,
  GetAllComment,
  UpdateComment,
  DeleteComment,

}

