const   asyncWrapper = require('../utils/asyncWrapper'),
        {isAdministrator, isLoggedIn} = require('../middleware/userMiddleware'),       
        User = require('../models/user');

const getUserEdit = asyncWrapper(async(req, res) => {
    const user = await User.findById(req.params.userID);
    if (user.isPremium) {
      await User.findByIdAndUpdate(req.params.userID, {isPremium:false});
    }else{
      await User.findByIdAndUpdate(req.params.userID, {isPremium:true});   
    }
    req.flash('success', 'Subscription set successfully');
    res.redirect('/platformadmin/allusers');
  })

  const getDeleteUser = asyncWrapper(async(req, res) => {
    await User.findByIdAndDelete(req.params.userId);
    req.flash('success', 'User deleted successfully');
    res.redirect('/platformadmin/allusers');
  })


module.exports = {
    getUserEdit,
    getDeleteUser
}


