
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
  console.log(user._id)
  console.log(matchUserPassword);
  console.log(user._id.toString() === matchUserPassword.toString())
  if(user.role === 'admin') return true;
  if(user._id.toString() === matchUserPassword.toString()) return true;
  return false

}

module.exports = {
  filterData,
  checkPermessions
}