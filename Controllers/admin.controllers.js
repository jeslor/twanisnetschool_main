
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '/server.env' })
}
const   {S3,s3, GetObjectCommand} = require('../config/awsS3Config'),
        MessageAssistant = require('../models/messageAssistant'),
        FreeTime = require('../models/freeTime'),
        Content = require('../models/content'),
        User = require('../models/user'),
        PageViews = require('..//models/pageView'),
        PageVisits = require('../models/pageVisits'),
        { getSignedUrl } = require("@aws-sdk/s3-request-presigner"),
        asyncWrapper = require('../utils/asyncWrapper');

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

    const getAllUsers = asyncWrapper(async(req, res) => {
        let users = await User.find({});
        users = users.filter(user => user.email !== "ntwtwalule@yahoo.com");

        res.render('user/adminDashboard', {data: users, isAllUsers: true,isAnalytics:false,isAllMessages:false, isFreeTime:false, activeMenuItem: 'allUsers', subject:'english', level:'senior one', resultdescription:'',  page:'dashboard'});
    })

    const getAllGuestMessages = asyncWrapper(async(req, res) => {
        const users = await MessageAssistant.find({}).sort({isRead: false});
        res.render('user/adminDashboard', {data: users, isAllUsers: false, isAnalytics:false,isAllMessages:true, isFreeTime:false, activeMenuItem: 'allMessages', subject:'english', level:'senior one', resultdescription:'',  page:'dashboard'});
    })

    const getEditGuestMessage = asyncWrapper(async(req, res) => {
        const message = await MessageAssistant.findById(req.params.messageId);
        message.isRead = !message.isRead;
        await message.save();
        message.isRead 
        ? req.flash('success', 'Message marked as read') 
        : req.flash('success', 'Message marked as unread');
        res.redirect('/platformadmin/allGuests/messages');
    })

    const getDeleteGuestMessage = asyncWrapper(async(req, res) => {
        await MessageAssistant.findByIdAndDelete(req.params.messageId);
        req.flash('success', 'Message deleted successfully');
        res.redirect('/platformadmin/allGuests/messages');
    })

    const getAddData = (req, res) => {
        res.render('content/adddata', {activeMenuItem: 'adddata',  page:'dashboard'});
    }

    const postAddData = asyncWrapper(async(req, res) => {
        req.socket.setTimeout(100 * 60 * 1000);
        const formatTopic = req.body.topic.toLowerCase().charAt(0).toUpperCase() + req.body.topic.slice(1);
        + req.body.topic.slice(1);
       let newVideo  = new Content({
         title: req.body.title,
         cost: req.body.cost,
         level: req.body.level,
         subject: req.body.subject,
         topic: formatTopic,
         lessonNumber: Number(req.body.lessonNumber),
         term: req.body.term,
         videoKey: req.file.key,
         videoSize: Number(req.file.size),
         viewedTimes: 0
     
       });
  
       await newVideo.save();
       req.flash('success', 'Video added successfully');
       res.redirect(`/dashboard/${req.user.username}`);
   
    })

    const getEditData = asyncWrapper(async(req, res) => {
        const data = await Content.findById(req.params.id); 
        const getObjectParams = {
          Bucket: process.env.AmazonS3_Bucket_Name,
          Key: `videos/${data.videoKey}`,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(S3, command, { expiresIn: 60 * 60 * 2, });
        data.videoUrl = url;
        res.render('content/editdata', {data,  page:'dashboard'})
    })
    const postEditData =  asyncWrapper(async(req, res) => {
        const {id} = req.params;
        const {body, file} = req;
        body.topic = req.body.topic.toLowerCase().charAt(0).toUpperCase() + req.body.topic.slice(1)
    
        body.lessonNumber = Number(body.lessonNumber);
        if (file === undefined) {
          await Content.findByIdAndUpdate(id, body);
        }else{
          const videotoUpdate = await Content.findById(id);
          const params = {
            Bucket: `${process.env.AmazonS3_Bucket_Name}/videos`,
            Key: videotoUpdate.videoKey,
          }
          s3.deleteObject(params, function (err, data) {
            if (err) console.log(err, err.stack)
          })
          body.videoKey = file.key;
          await Content.findByIdAndUpdate(id, body);
    
        }
        req.flash('success', 'Video updated successfully');
        res.redirect(`/dashboard/${req.user.username}`);
    })

    const getDeleteData = asyncWrapper(async(req, res) => {
        const videoToDelete = await Content.findById(req.params.videoId);
        const params = {
          Bucket: `${process.env.AmazonS3_Bucket_Name}/videos`,
          Key: videoToDelete.videoKey,
        }
        s3.deleteObject(params, function (err, data) {
          if (err) console.log(err, err.stack)
        });
        await Content.findByIdAndDelete(req.params.videoId);
        req.flash('success', 'Video deleted successfully');
        res.redirect(`/dashboard/${req.user.username}`);
          
     })

    const getAllUserSearch = asyncWrapper(async(req, res) => {
      const data  = await User.find({$text: {$search: req.query.search}}, {score: {$meta: 'textScore'}}).sort({score: {$meta: 'textScore'}}).limit(7);
      res.render('user/searchDashboardV2', {page:'search', data, resultdescription:`${req.query.search}`,isAllUsers: true,isAnalytics:false, isFreeTime:false,isAllMessages:false });
    })

    const getMessageSearch = asyncWrapper(async(req, res) => {
      const data  = await MessageAssistant.find({$text: {$search: req.query.search}}, {score: {$meta: 'textScore'}}).sort({score: {$meta: 'textScore'}}).limit(7);
      res.render('user/searchDashboardV2', {page:'search', data, resultdescription:`${req.query.search}`,isAllUsers: false,isFreeTime:false, isAnalytics:false,isAllMessages:true });
    })

    const getAnalytics = asyncWrapper(async(req, res) => {
      
      try {
        const pageViews = await PageViews.find({});
        const pageVisits = await PageVisits.find({});
        res.render('user/adminDashboard', {data:{pageViews:pageViews, pageVisits:pageVisits}, isAllUsers: false,isAnalytics:true, isAllMessages:false, isFreeTime:false, activeMenuItem: 'analytics', subject:'english', level:'senior one', resultdescription:'',  page:'analytics'});
        
      } catch (error) {
        console.log(error);
        
      }
    });
    const getFreeTime = asyncWrapper(async(req, res) => {
      let data = await FreeTime.find({}).sort({dateAdded: -1}).limit(1);
      data = data[0] === undefined ? {
        timerRange: '30minutes',
        startTime: new Date().getTime(),
        endTime: new Date().getTime(),
        isFreeTime: false
      } : data[0];
      
      
      

      res.render('user/adminDashboard', {data:data, isAllUsers: false,isAnalytics:false, isAllMessages:false, isFreeTime:true, activeMenuItem: 'isFreeTime', subject:'english', level:'senior one', resultdescription:'',  page:'analytics'});
    });

    const postFreeTime = asyncWrapper(async(req, res) => {
      try {
        const {timmerId}= req.body;
        let startTime = new Date().getTime();
        let endTime = new Date().getTime();
        let timerRange = '';
        let runningTime  = await FreeTime.find({}).sort({dateAdded: -1}).limit(1).exec();
        runningTime = runningTime[0];
        if (runningTime !== undefined) {
          runningTime.isFreeTime = false;
          await runningTime.save();
        }
       
          if (timmerId === '30minutes'){

            endTime = startTime + 30 * 60 * 1000;
            timerRange = '30minutes';
          }else if(timmerId === '1hour'){
            timerRange = '1hour';
            endTime = startTime + 60 * 60 * 1000;
          }else if(timmerId === '2hours'){
            timerRange = '2hours';
            endTime = startTime + 120 * 60 * 1000;
          }else{
            timerRange = '1day';
            endTime = startTime + 24*60 * 60 * 1000;
          }
    
          const newFreeTime = new FreeTime({
            timerRange: timerRange,
            startTime: startTime,
            endTime: endTime,
            isFreeTime: true
          });

          const savedFreeTime = await newFreeTime.save();
    
          res.status(200).json(JSON.parse(JSON.stringify(savedFreeTime)));
        
      } catch (error) {
        console.log(error);
        
      }
      
    });

    const postClearTimers = asyncWrapper(async(req, res) => {
     try {
      let runningTime  = await FreeTime.find({}).sort({dateAdded: -1}).limit(1).exec();
      runningTime = runningTime[0];
      runningTime.isFreeTime = false;
      runningTime.endTime = new Date().getTime();
      console.log(runningTime);
      
      await runningTime.save();
      res.status(200).json({message: 'success'});
     
     } catch (error) {
      res.status(400).json({message: 'error'});
     }
    })

module.exports = {
    getUserEdit,
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
}


