const express = require('express'),
        router = express.Router(),
        {upladimage, uploadVideo} = require('../config/videoUploder'),

        {isLoggedIn, isAdministrator} = require('../middleware/userMiddleware'),
        {getUserEdit, getDeleteUser} = require('../Controllers/admin.controllers');


    router.get('/edituser/:userID/setSubscription', isLoggedIn, getUserEdit);
    router.delete('/deleteuser/:userId',isLoggedIn, isAdministrator, getDeleteUser);
    router.get('/allusers', isLoggedIn, isAdministrator, );
    router.get('/allGuests/messages', isLoggedIn, isAdministrator, );
    router.get('/allGuests/messages/:messageId', isLoggedIn, isAdministrator, );
    router.delete('/allGuests/messages/:messageId', isLoggedIn, isAdministrator, );
    router.get('/adddata',isLoggedIn, isAdministrator,);
    router.post('/adddata',isLoggedIn, isAdministrator, uploadVideo.single('uploadedvideo'),);
    router.get('/editdata/:id',isLoggedIn, isAdministrator, );
    router.put('/editdata/:id',isLoggedIn, isAdministrator, uploadVideo.single('uploadedvideo'),);
    router.delete('/deletedata/:videoId',isLoggedIn, isAdministrator, );
  


module.exports = router;