const mongoose = require('mongoose');
const blockschema = new mongoose.Schema({

  blockedBy:{
   type:mongoose.Schema.Types.ObjectId,
   required:true,
   ref:'User',
  },
  blockThisUser:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User',
  }

},{
  timestamps:true,
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
})

const Block = mongoose.model('Block', blockschema);
module.exports= Block;