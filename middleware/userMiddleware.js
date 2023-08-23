const  User  = require( '../models/user.js'),
asyncWrapper = require('../utils/asyncWrapper');


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

module.exports .isPremium = asyncWrapper(async(req, res, next)=>{
  const activeUser  =  await User.findById(req.user._id)
  console.log(activeUser);
  if((req.isAuthenticated()&&activeUser.username === '0775527077' && activeUser.email ==='twaninetschool@gmail.com') || (req.isAuthenticated()&&activeUser.isPremium === true)){
    return next();
  }else{
    req.flash('error', 'You have to pay subscription to access these videos')
    return res.redirect('/makepayment')
  }
})
  