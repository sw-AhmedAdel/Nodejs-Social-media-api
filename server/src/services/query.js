
function filterData (obj , ...arr) {
  const filter = {};
  Object.keys(obj).forEach((el) => {
    if(arr.includes(el)){
      filter[el] = obj[el]
    }
  })
  return filter;
}

module.exports = {
  filterData
}