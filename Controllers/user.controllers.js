const asyncWrapper = require('../utils/asyncWrapper'),
      User = require('../models/user'),
      Content = require('../models/content'),
      MessageAssistant = require('../models/messageAssistant'),
      { getSignedUrl } = require("@aws-sdk/s3-request-presigner"),
      { v4: uuidv4 } = require('uuid');
    
    
    const getLogin = (req, res) => {
        if(req.isAuthenticated()){ 
        return res.redirect(`/dashboard/${req.user.username}`)};
        res.render('user/login', {page:'login'});
    }

    const postLogin = (req, res) => {
        req.flash('success', 'Welcome back!');
        res.redirect(`/dashboard/${req.user.username}`);
    }

    const getRegister = (req, res) => {
        if(req.isAuthenticated()){ 
        return res.redirect(`/dashboard/${req.user.username}`)};
        res.render('user/register', {message:'', page:'register'});
    }

    const postRegister =  asyncWrapper(async(req, res) => {
        const buildsecretes = `${uuidv4()}--${req.body.password}--${uuidv4()}`
        const tempEmail = `${uuidv4()}@twanisnetschool.com`
        try {
          const {username, password,studentLevel,firstName,lastName, schoolName} = req.body;
          const registerUser = new User({username,studentLevel,firstName,lastName, schoolName, buildsecretes,email:tempEmail });
          const registeredUser = await User.register(registerUser, password);
          req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Twanis Net School');
            res.redirect(`/dashboard/${registeredUser.username}`);
          });
        } catch (error) {
          console.log(error);
          let {message} = error;
          console.log(message);
          if(message.includes('given username is already registered')){
          message = 'This phone number is already registered';
          }else{
            message = 'invalid details';
          }
          res.render('user/register',{message, page:'register'});
        }
    })


    const getLogout = (req, res) => {
        req.logout((err)=>{
          if(err) return next(err);
        });
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    }

    const getsendUserMessage  = asyncWrapper(async(req, res) => {

        let {guestMessage, guestName, guestPhone} = req.body;
        guestName = guestName.trim();
        guestPhone = guestPhone.trim();
        guestMessage = guestMessage.trim();
        await MessageAssistant.create({guestMessage, guestName, guestPhone});
        req.flash('success', 'Message sent successfully');
        res.render('about', {page:'about', message:'Message sent successfully'}); 
    
      })
    const postSearchInput = asyncWrapper(async(req, res) => {
        let {searchSuggestion} = req.body;
        let suggestions =[];
        let finalWords  = [];
    
         await Content.find({$text: {$search: searchSuggestion}}, {score: {$meta: 'textScore'}}).sort({score: {$meta: 'textScore'}}).limit(7).then(
          data => {
            data.map(video => {
            suggestions.push(video.title);
            suggestions.push(video.subject);
            suggestions.push(video.topic);
            suggestions.push(video.level);
          });
          const word = searchSuggestion.toLowerCase();
          suggestions = suggestions.filter(sug => sug.toLowerCase().includes(word));
          suggestions.forEach(sug =>{
            const index  = sug.toLowerCase().indexOf(word);
            const newSent = sug.slice(index, sug.length);
            finalWords.push(newSent);
          });
          finalWords = [...new Set(finalWords)];
        }
        );
       
       
        res.send(finalWords);
    })

    const getSearchResults = asyncWrapper(async(req, res) => {
        const data  = await Content.find({$text: {$search: req.query.search}}, {score: {$meta: 'textScore'}}).sort({score: {$meta: 'textScore'}}).limit(20);
        res.render('user/searchDashboardV2', {page:'search', data, resultdescription:`${req.query.search}`});
    })
    
    const getPlayPremiumVideo = asyncWrapper(async(req, res) => {

        const data = await Content.findById(req.params.videoID);
        const getObjectParams = {
          Bucket: process.env.AmazonS3_Bucket_Name,
          Key: `videos/${data.videoKey}`,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(S3, command, { expiresIn: 60 * 60 * 2, });
        data.videoUrl = url;
        let similarVideos = await Content.find({topic:data.topic}).sort({lessonNumber: 1});
        res.render('content/viewdata', {data, similarVideos, page:'dashboard'});
    })

    const getPlayFreeVideo =  asyncWrapper(async(req, res) => {
        const data = await Content.findById(req.params.videoID);
        const getObjectParams = {
        Bucket: process.env.AmazonS3_Bucket_Name,
        Key: `videos/${data.videoKey}`,
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(S3, command, { expiresIn: 60 * 60 * 2, });
      data.videoUrl = url;
        let similarVideos = await Content.find({topic:data.topic}).sort({lessonNumber: 1});
      res.render('content/viewdata', {data, similarVideos,  page:'dashboard'});
    })

    const getUser = asyncWrapper(async(req, res) => {
        const {search} = req.query;
      if (search) {
        const data = await Content.find({$text: {$search: search}}, {score: {$meta: 'textScore'}}).sort({score: {$meta: 'textScore'}});
        const {username, email} = req.user;
        if(username==='0775527077' && email ==='twaninetschool@gmail.com'){
          res.render('user/adminDashboard', {data, isAllUsers: false,isAllMessages:false, level:'dummy', subject:'english', activeMenuItem: 'dashboard', resultdescription:`${search}`,  page:'dashboard'});
        }else{
          res.render('user/dashboardV2', {data, level:'dummy', subject:'english', activeMenuItem: 'dashboard', resultdescription:`${search}`,  page:'dashboard'});
        }
      }else{
        const data = await Content.find({}).sort({dateAdded: -1}).limit(20);
        const totalItems = await Content.countDocuments();
        const {username, email} = req.user;
        if(username==='0775527077' && email ==='twaninetschool@gmail.com' ){
          let page = Number(req.query.page || 1)
          let perPage = 10
          let pages = Math.ceil(totalItems / perPage)
          const totalpages = page + 3 >= pages ? pages : page + 3
          res.render('user/adminDashboard', {data,page,pages,totalItems,totalpages, isAllUsers: false,isAllMessages:false, level:'senior one', subject:'english', activeMenuItem: 'dashboard', resultdescription:'',  page:'dashboard'});
        }else{
          res.render('user/dashboardV2', {data, level:'dummy', subject:'english', activeMenuItem: 'dashboard',resultdescription:'',  page:'dashboard'});
        }
      }
      
    })

    const getUserSubject = asyncWrapper(async(req, res) => {
        const{subject} = req.params;
        const levels = await Content.find({subject});
        const schoolLevels = [];
        levels.map(level => {
          if(!schoolLevels.includes(level.level)){
            schoolLevels.push(level.level);
          }
        })
        res.render('user/dashboardV2Class', {subjectSelected:subject, schoolLevels,  page:'dashboard'});
    });

    const getUserLevel = asyncWrapper(async(req, res) => {
        const{subject, level} = req.params;
        const terms = await Content.find({subject, level});
        const schoolTerms = [];
        terms.map(term => {
          if(!schoolTerms.includes(term.term)){
            schoolTerms.push(term.term);
          }
        })
        res.render('user/dashboardV2Term', {subjectSelected:subject, levelSelected:level, schoolTerms,  page:'dashboard'});
    })

    const getUserTerm = asyncWrapper(async(req, res) => {
        const {level, subject, term} = req.params;
        const data = await Content.find({level, subject, term});
        const topics =  [];
        data.map(video => {
          if(!topics.includes(video.topic)){
            topics.push(video.topic);
          }
        })
        res.render('user/dashboardV2Topic', {subjectSelected:subject, levelSelected:level, termSelected:term, topics,  page:'dashboard'});
    })

    const getUserTopic = asyncWrapper(async(req, res) => {
        const {level, subject, term, topic} = req.params;
        const lessons  = await Content.find({subject: subject, level: level, term: term, topic: topic}).sort({lessonNumber: 1});
        res.render('user/dashboardV2Lesson', {subject, level, term, topic, lessons,  page:'dashboard'});
    })



module.exports = {
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
}
