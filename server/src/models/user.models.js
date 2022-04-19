const User = require('./user.mongo');


async function CreateUser(user) {
  const newUser = new User(user);
  await newUser.save();
  return newUser;
}

async function findByrCedenitals( email , password) {
  return await User.findByrCedenitals(email , password);
}

async function GetALlUsers() {
  return await User.find();
}

async function FindUser (filter) {
  return await User.findOne(filter);
}



async function UpdateUser (editUser, id) {
  const user = await User.findByIdAndUpdate(id , editUser , {
    new:true,
    runValidators:true
  })
  return user;
}

async function DeleteUser (id) {
  await User.findByIdAndUpdate(id , {
    active: false
  });
  
}

async function GetUserStats () {
  const users = await User.aggregate([

    {
    
      $unwind :'$createdAt'
      }
      ,
      {
        $group: {
          _id: {$month: '$createdAt'},//means get me each tour in the same month and put it in group
          numOfUsers:{$sum: 1}, // count each tour in group
        }
      }
      ,
      {
        $addFields:{
          month:'$_id'
        }
      }
      ,
      {
        $project:{
          _id:0
        }
      }
    
  
  ])
  return users;
}

module.exports = {
  CreateUser,
  GetALlUsers,
  FindUser,
  UpdateUser,
  DeleteUser,
  findByrCedenitals,
  GetUserStats

}