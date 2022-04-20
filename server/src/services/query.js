const {GetSinglePost} = require('../models/post.models');

function filterData (obj , ...arr) {
  const filter = {};
  Object.keys(obj).forEach((el) => {
    if(arr.includes(el)){
      filter[el] = obj[el]
    }
  })
  return filter;
}

function checkPermessions (user , matchUserPassword ) {
  if(user.role === 'admin') return true;
  if(user._id.toString() === matchUserPassword.toString()) return true;
  return false

}
async function checkExtraPermessions(user , comment) {
  const post = await GetSinglePost({
    _id: comment.post
  })
  if(user._id.toString()  ===post.user.toString()) return true;
  return checkPermessions(user , comment.user);

}

module.exports = {
  filterData,
  checkPermessions,
  checkExtraPermessions
}