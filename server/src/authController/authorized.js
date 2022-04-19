
const appError = require('../handelErros/class.handel.errors');

function authorized (...role) {
  return (req , res, next) => {
   if(!role.includes(req.user.role)){
     return next( new appError('you do not have permission to do this action'), 401);
   }
   next();
  }
}

module.exports = authorized;