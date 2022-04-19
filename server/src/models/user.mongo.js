const mongoose = require('mongoose');
const validator = require('validator'); 
const jwt = require('jsonwebtoken');
const crypto= require('crypto'); 
const bcrypt = require('bcrypt');
const userScheam = new mongoose.Schema({

  name: {
    //unique:true,
    type: String,
    required:[true, 'Please provide your name'],
    minlength:[3, 'Name must be more or equal 3 chars'],
    maxlength:[20, 'Name must be less or equal 20 chars'],
  },
  email: {
    type: String,
    unique: true,
    required:[true, 'Please provide your email'],
    validate: [validator.isEmail , 'Please provide a valid email']
  },

  password: {
    type: String,
    required: [true,'Please provide a password'],
    min:[8 , 'Password must be more or equal 8 chars'],
  },
  passwordConfirm : {
    type: String,
    required: [true,'Please provide a password'],
    min:[8 , 'Password must be more or equal 8 chars'],
    validate: {
      validator: function(val) {
        return val ===  this.password
      },
      message :'passwords are not the same'
    }
  },

  followers:{
    type: Array,
    default:[]
  },
  followings:{
    type: Array,
    default:[]
  },
  city:{
    type:String,
    max:30,
  },
  desc: {
    type:String,
    max: 50,
  }
  ,
  profilePic: {
    type: String,
    default:"",
  },
  coverPic: {
    type: String,
    default:"",
  }
  ,
  role: {
    type: String,
    enum:['admin','user'],
    default:'user',
  }
  ,
   gender: {
     type:String,
     required:[true,'Please provie your gender'],
     enum:{
       values:['male','female'],
       message:'Gender must be male, female'
     }
   },
 
  passwordChangedAt : Date,
  passwordResetToken : String ,
  passwordResetExpires : Date,
  active: {
    type: Boolean,
    default: true,
  },
  
}, {
   timestamps:true,
   toJSON: {virtuals : true},
   toObject:{virtuals : true}
})


userScheam.methods.toJSON = function(){
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.passwordConfirm;
  return userObject;
}



userScheam.methods.changePasswordAfter = function(jwtTime) {
  const user = this;
  if(user.passwordChangedAt) {
  const userPasswordTime = parseInt(user.passwordChangedAt.getTime() /1000 , 10);
  return jwtTime < userPasswordTime
  }
  return false;
}


userScheam.methods.createverificationToken = async function(){
  const user = this;
  const token = crypto.randomBytes(32).toString('hex');
  user.verificationToken  = crypto.createHash('sha256').update(token).digest('hex');
  await user.save()
  return token;
}

userScheam.methods.createpasswordResetToken = async function(){
  const user = this;
  const token = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  user.passwordResetExpires = Date.now() + 10 * 60 *100;
  await user.save();
  return token;
}


userScheam.methods.comparePassword =async  function(candidatePassword , userPassword) {
  return await bcrypt.compare(candidatePassword , userPassword);
}

userScheam.statics.findByrCedenitals = async function(email , password) {
  const user = await User.findOne({
    email,
  })
  if(!user) {
    return false;
  }
  const isMatch = await bcrypt.compare(password , user.password);
  if(!isMatch){
    return false;
  }
  return user;
}

userScheam.methods.getAuthToken = function() {
  const user = this;
  const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET ,{expiresIn:process.env.JWT_EXPIRES_IN})
  return token;
}


userScheam.pre('save' , async function(next){
  const user = this;
  if(user.isNew || !user.isModified ('password')){
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;
  next();
})

userScheam.pre('save' , async function(next){
  const user = this;
  if(user.isModified ('password')) {
    user.password = await bcrypt.hash(user.password , 12);
    user.passwordConfirm = user.password;
  }
  next();
})

userScheam.pre(/^find/ , function(next) {
  this.find({active : {$ne : false}})
  next();
})


const User=  mongoose.model('User' , userScheam);
module.exports = User;