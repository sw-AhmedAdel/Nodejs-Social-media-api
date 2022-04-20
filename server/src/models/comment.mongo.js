const mongoose = require('mongoose');
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
  }
}, {
 toJSON:{virtuals: true},
 toObject:{virtuals:true},
 timestamps:true
})

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;