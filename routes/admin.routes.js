

const express = require('express'),
        router = express.Router(),
        {upladimage, uploadVideo} = require('../config/videoUploder'),

        {isLoggedIn, isAdministrator} = require('../middleware/userMiddleware'),
        { getUserEdit,
            getDeleteUser,
            getAllUsers,
            getAllGuestMessages,
            getEditGuestMessage,
            getDeleteGuestMessage,
            getAddData,
            postAddData,
            getEditData,
            postEditData,
            getDeleteData,
            getAllUserSearch,
            getMessageSearch,
            getAnalytics,
            getFreeTime,
            postFreeTime,
            postClearTimers
        } = require('../Controllers/admin.controllers');


    router.get('/edituser/:userID/setSubscription', isLoggedIn, getUserEdit);
    router.delete('/deleteuser/:userId',isLoggedIn, isAdministrator, getDeleteUser);
    router.get('/allusers', isLoggedIn, isAdministrator, getAllUsers);
    router.get('/allGuests/messages', isLoggedIn, isAdministrator, getAllGuestMessages);
    router.get('/allGuests/messages/search',isLoggedIn, isAdministrator, getMessageSearch);
    router.get('/allGuests/messages/:messageId', isLoggedIn, isAdministrator,getEditGuestMessage );
    router.delete('/allGuests/messages/:messageId', isLoggedIn, isAdministrator, getDeleteGuestMessage );
    router.get('/adddata',isLoggedIn, isAdministrator, getAddData);
    router.post('/adddata',isLoggedIn, isAdministrator, uploadVideo.single('uploadedvideo'),postAddData);
    router.get('/editdata/:id',isLoggedIn, isAdministrator, getEditData);
    router.put('/editdata/:id',isLoggedIn, isAdministrator, uploadVideo.single('uploadedvideo'),postEditData);
    router.delete('/deletedata/:videoId',isLoggedIn, isAdministrator, getDeleteData);
    router.get('/allusers/search',isLoggedIn, isAdministrator, getAllUserSearch);
    router.get("/analytics",isLoggedIn,isAdministrator, getAnalytics);
    router.get('/setFreeTime',isLoggedIn,isAdministrator, getFreeTime);
    router.post('/setFreeTime',isLoggedIn,isAdministrator, postFreeTime);
    router.post('/clearFreeTime',isLoggedIn,isAdministrator, postClearTimers);
  


module.exports = router;