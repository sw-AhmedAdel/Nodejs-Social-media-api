const Post = require('./post..mongo');

async function CreatePost (req) {
  const newPost = new Post({
    ...req.body,
    user: req.user._id
  });
  await newPost.save();
  return newPost;
}

async function GetAllPost(filter) {
  return await Post.find(filter)
}

async function GetSinglePost(filter) {
  return await Post.findOne(filter);
}

async function FindUser(filter){
  return await GetSinglePost(filter)
}

async function UpdatePost(editPost , id) {
  const post = await Post.findByIdAndUpdate(id , editPost , {
    new:true,
    runValidators:true,
  })

  return post;
}

// when i delete Post i must delete the all Post and reviewing on it 
async function DeletePost(id) {
  await Post.findByIdAndDelete(id);
}


module.exports = {
  CreatePost,
  GetSinglePost,
  GetAllPost,
  UpdatePost,
  DeletePost,
  FindUser,
}

