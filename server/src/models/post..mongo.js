const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({

    user:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:'User'
    },
    desc:{
      type:String,
      required:true,
      max: 500,
    },
    image:{
      type:String,
    },
    likes: {
      type : Array,
     default: [],
    }
}, {
  timestamps:true,
  toJSON:{virtuals: true},
  toObject:{virtuals: true}
})

const Post = mongoose.model('Post', postSchema);
module.exports = Post;