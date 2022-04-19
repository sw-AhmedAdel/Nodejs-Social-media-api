
class filterFeaturs {
  constructor (query , filter) {
    this.query = query ;
    this.filter =filter;
  }

  filterFun(){
    let modifiedFilter = JSON.stringify(this.filter);
    modifiedFilter = modifiedFilter.replace(/\b(gt|lt|gte|ltr)\b/g , match => `$${match}`);
    return JSON.parse(modifiedFilter);
  }

  sortBy(){
    if(this.query.sort) {
      return this.query.sort.split(',').join(' ');
    }
    return 'year'
  }


 getPagination() {
  const DEFAULT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_LIMIT = 0;  
  const page = Math.abs(this.query.page) || DEFAULT_PAGE_NUMBER;
  const limit = Math.abs(this.query.limit) || DEFAULT_PAGE_LIMIT;
  const skip = (page - 1) * limit; 
 
  return {
    skip,
    limit,
  };
 }

}

module.exports = filterFeaturs;