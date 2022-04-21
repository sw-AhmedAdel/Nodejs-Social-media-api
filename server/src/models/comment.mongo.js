const mongoose = require('mongoose');
const Post = require('./post..mongo');
const commentSchema = new mongoose.Schema({

  user:{
   type:mongoose.Schema.Types.ObjectId ,
   required:true,
   ref:'User,'
  },
  post:{
   type:mongoose.Schema.Types.ObjectId ,
   required:true,
   ref:"Post"
  },
  desc:{
    type:String,
    required:true,
    max: 200,
  },
  numberOfLikes: {
    type:String,
    default:0
  }
}, {
 toJSON:{virtuals: true},
 toObject:{virtuals:true},
 timestamps:true
})


commentSchema.statics.calcNumberOfCommentsOnPost = async function(post_id) {
  const stats = await Comment.aggregate([
    {
      $match:{
        post :post_id 
      }
    },
    {
      $group:{
        _id:null,
        numberOfComments:{$sum : 1}
      }
    }
  ])
  
  await Post.findByIdAndUpdate(post_id,{
    numberOfComments: stats[0]?.numberOfComments || 0
  })
}

commentSchema.post('save' ,async function(){
  const comment = this;
  await comment.constructor.calcNumberOfCommentsOnPost(comment.post)
  
})

commentSchema.post('remove' ,async function(comment) {
  await comment.constructor.calcNumberOfCommentsOnPost(comment.post)
  await this.model('LikeComment').deleteMany({comment :comment._id })
})

/* can not use findOneAndDelete when i want to delete many likes 
when i want to delete just one like it is ok to use aggregate to get thr reflection on comment
but if i want to delete many likes just use remove and here delete all of them
commentSchema.post(/^findOneAndDelete/ ,async function(comment) {
  await comment.constructor.calcNumberOfCommentsOnPost(comment.post)
  await this.model('LikeComment').deleteMany({comment :comment._id })
})*/




const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;