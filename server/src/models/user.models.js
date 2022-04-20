const User = require('./user.mongo');


async function CreateUser(user) {
  const newUser = new User(user);
  await newUser.save();
  return newUser;
}

async function findByrCedenitals( email , password) {
  return await User.findByrCedenitals(email , password);
}

async function GetALlUsers(filter) {
  return await User.find(filter);
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



module.exports = {
  CreateUser,
  GetALlUsers,
  FindUser,
  UpdateUser,
  DeleteUser,
  findByrCedenitals,

}