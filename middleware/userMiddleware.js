module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

module.exports.isAdministrator =(req, res, next)=>{
  if(req.isAuthenticated()&&req.user.username === '0775527077' && req.user.email ==='twaninetschool@gmail.com'){
    return next();
  }else{
    req.flash('error', 'You dont have permission to go here')
    return res.redirect('/')
  }
}