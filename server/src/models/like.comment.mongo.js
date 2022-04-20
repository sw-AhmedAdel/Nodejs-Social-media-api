const monggose = require('mongoose');
const Comment = require('./comment.mongo');

const likeCommentSchema = new monggose.Schema({
  user:{
    type:monggose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
  },
  comment:{
    type:monggose.Schema.Types.ObjectId,
    required:true,
    ref:'Comment'
  }
}, {
  timestamps: true,
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
})


likeCommentSchema.statics.calcNumberOfLikesOnComment = async function(comment_id){
  const stats = await LikeComment.aggregate([
    {
      $match: { comment: comment_id }
    },
    {
      $group:{
        _id:null,
        numberOfLikes:{$sum : 1}
      }
    }
  ])
  await Comment.findByIdAndUpdate(comment_id, {
    numberOfLikes:stats[0]?.numberOfLikes || 0
  })
}

likeCommentSchema.post('save', async function(){
  const like = this;
  await like.constructor.calcNumberOfLikesOnComment(like.comment)
})

likeCommentSchema.post(/^findOneAndDelete/ ,async function(like) {
  await like.constructor.calcNumberOfLikesOnComment(like.comment)
})

const LikeComment = monggose.model('LikeComment', likeCommentSchema );
module.exports = LikeComment;