const { get } = require('mongoose');

const   express = require('express'),
        router = express.Router(),
        passport = require('passport'),
        {isLoggedIn, isPremium} = require('../middleware/userMiddleware'),
        {
            getLogin,
            postLogin, 
            getRegister, 
            postRegister, 
            getLogout, 
            getsendUserMessage, 
            postSearchInput, 
            getSearchResults,
            getPlayPremiumVideo,
            getPlayFreeVideo,
            getUser,
            getUserSubject,
            getUserLevel,
            getUserTerm,
            getUserTopic
        } = require('../Controllers/user.controllers');


        router.get('/login', getLogin);
        router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}), postLogin);
        router.get('/register', getRegister);
        router.post('/register', postRegister);
        router.get('/logout', getLogout);
        router.post('/guestUser/sendmessage',getsendUserMessage )
        router.post('/searchInput', postSearchInput);
        router.get('/dashboard/:user/search', isLoggedIn, getSearchResults);
        router.get('/dashboard/subscriptions/video/playnow/:videoID', isLoggedIn,isPremium, getPlayPremiumVideo);
        router.get('/dashboard/free/video/playnow/:videoID', getPlayFreeVideo);
        router.get('/dashboard/:user',isLoggedIn, getUser);
        router.get('/dashboard/:user/:subject', isLoggedIn, getUserSubject);
        router.get('/dashboard/:user/:subject/:level', isLoggedIn, getUserLevel);
        router.get('/dashboard/:user/:subject/:level/:term', isLoggedIn, getUserTerm);
        router.get('/dashboard/:user/:subject/:level/:term/:topic', isLoggedIn, getUserTopic);



module.exports = router;
