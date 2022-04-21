const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
   
   isShared: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Post'
   },
   sharedFrom:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
   }, 
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
    },
    numberOfComments: {
      type:Number,
      default:0
    },
    display:{
      type:String,
      enum:['onlyme','public','followers'],
      default:'public'
    }
 
}, {
  timestamps:true,
  toJSON:{virtuals: true},
  toObject:{virtuals: true}
})
/*
postSchema.pre(/^find/ , function( next) {
   this.find( { display: { $ne :'onlyme'} } )
   
   next();
 })*/

const Post = mongoose.model('Post', postSchema);
module.exports = Post;