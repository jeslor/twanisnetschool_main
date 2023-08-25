const express = require('express'),
        router = express.Router(),
        passport = require('passport'),
        {isLoggedIn, isAdministrator} = require('../middleware/userMiddleware'),
        {getUserEdit, getDeleteUser} = require('../Controllers/admin.controllers');


    router.get('/edituser/:userID/setSubscription', isLoggedIn, getUserEdit);
    router.delete('/platformadmin/deleteuser/:userId',isLoggedIn, isAdministrator, getDeleteUser)

module.exports = router;