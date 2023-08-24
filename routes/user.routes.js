const   express = require('express'),
        router = express.Router(),
        passport = require('passport'),
        {getLogin, postLogin, getRegister, postRegister, getLogout} = require('../Controllers/user.controllers');


        router.get('/login', getLogin);
        router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}), postLogin);
        router.get('/register', getRegister);
        router.post('/register', postRegister);
        router.get('/logout', getLogout);

module.exports = router;
