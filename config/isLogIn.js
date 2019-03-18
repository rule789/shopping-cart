// 存取控制 檢查登入
function ensureAuth(req, res, next) {
  // console.log(req.isAuthenticated()); // true false
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}


module.exports = ensureAuth;