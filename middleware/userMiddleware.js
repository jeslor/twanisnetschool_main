const Payment = require('../models/payment.js');
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
  const activeUser  =  await User.findById(req.user._id).populate({path:'payments', model: Payment, options:{sort:{'createdAt':-1}}})
  if((req.isAuthenticated()&&activeUser.username === '0775527077' && activeUser.email ==='twaninetschool@gmail.com')){
    return next();
  }
  if (activeUser.payments.length ===0) {
    if(activeUser.isPremium === true){
      await User.findByIdAndUpdate(activeUser._id, {...activeUser, isPremium:false})
    }
    req.flash('error', 'You need to subscribe to view these videos')
    return res.redirect('/makepayment')
  }
  const endDate = activeUser.payments[0].paymentEndDate;
  const currentDate = new Date();
  if((req.isAuthenticated()&&currentDate < endDate)){
    return next();
  }else{
    activeUser.isPremium = false;
    await activeUser.save();
    req.flash('error', 'Your subscription has expired')
    return res.redirect('/makepayment')
  }
})
  