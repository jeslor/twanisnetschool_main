
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '/server.env' })
}
const express = require('express'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    path = require('path'),
    methodOverride = require('method-override'),
    expressSsession = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    ejsmate = require('ejs-mate'),
    flash = require('connect-flash'),

    asyncWrapper = require('./utils/asyncWrapper'),

    {upladimage, uploadVideo} = require('./config/videoUploder'),
    {S3,s3, GetObjectCommand} = require('./config/awsS3Config'),
    { getSignedUrl } = require("@aws-sdk/s3-request-presigner"),
    {isLoggedIn, isAdministrator, isPremium} =require('./middleware/userMiddleware'),
    {getVideo} = require('./config/videoGetter'),
    User = require('./models/user'),
    Content = require('./models/content'),
    MessageAssistant = require('./models/messageAssistant'),
    userRoutes = require('./routes/user.routes'),
    adminRoutes = require('./routes/admin.routes'),
    app = express();
    

    const DBURL = process.env.DBURL || 'mongodb://localhost:27017/twanis_net_school';
    const port = process.env.PORT || 3000;

    mongoose.connect(DBURL, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => console.log('Connected to Database!'));


  app.use(express.json())
  app.use(cors())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.static(__dirname))
  app.use(express.static(path.join(__dirname, 'public')))
  app.use(methodOverride('_method'))
  app.use(
    expressSsession({
      secret: 'correctcard',
      resave: true,
      saveUninitialized: true,
      // cookie: { secure: true }
    }),
  )

  app.use(passport.initialize())
  app.use(passport.session())
  app.use(flash())

  passport.use(new LocalStrategy(User.authenticate()))
  passport.serializeUser(User.serializeUser())
  passport.deserializeUser(User.deserializeUser())

  app.set('view engine', 'ejs')
  app.engine('ejs', ejsmate)
  app.set('vews', path.join(__dirname, 'views'))
  app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currUser = req.user
    next()
  });







  app.listen(3000, () => console.log(`Server is running on port ${port}!`));


  app.get('/', asyncWrapper(async(req, res) => {
    const sampleVideos = await Content.find({cost:'free'}).limit(4);
      res.render('home', {sampleVideos, page:'home'});
  }));

app.use('/', userRoutes);
app.use('/platformadmin', adminRoutes);



  app.get('/about', (req, res) => {
    res.render('about', {page:'about'});
  });
  app.get('/makepayment', (req, res) => {
    res.render('makepayment', {page:'makepayment'});
  });

  app.get('/guide', (req, res) => {
    res.render('guide',{page:'guide'});
  });



  app.get('/dashboard/subscriptions/video/playnow/:videoID', isLoggedIn,isPremium, asyncWrapper(async(req, res) => {

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
  }))

  app.get('/dashboard/free/video/playnow/:videoID', asyncWrapper(async(req, res) => {
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
  }))

  app.get('/dashboard/:user',isLoggedIn, asyncWrapper(async(req, res) => {
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
    const data = await Content.find({}).sort({dateAdded: -1});
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
  
  }));

  app.get('/platformadmin/allusers', isLoggedIn, isAdministrator, asyncWrapper(async(req, res) => {
  const users = await User.find({});
  res.render('user/adminDashboard', {data: users, isAllUsers: true,isAllMessages:false, activeMenuItem: 'allUsers', subject:'english', level:'senior one', resultdescription:'',  page:'dashboard'});
  }));

  app.get('/platformadmin/allGuests/messages', isLoggedIn, isAdministrator, asyncWrapper(async(req, res) => {
  const users = await MessageAssistant.find({}).sort({isRead: false});
  res.render('user/adminDashboard', {data: users, isAllUsers: false, isAllMessages:true, activeMenuItem: 'allMessages', subject:'english', level:'senior one', resultdescription:'',  page:'dashboard'});
  }));
  app.get('/platformadmin/allGuests/messages/:messageId', isLoggedIn, isAdministrator, asyncWrapper(async(req, res) => {
  const message = await MessageAssistant.findById(req.params.messageId);
  message.isRead = !message.isRead;
  await message.save();
  message.isRead 
  ? req.flash('success', 'Message marked as read') 
  : req.flash('success', 'Message marked as unread');
  res.redirect('/platformadmin/allGuests/messages');
  }));

  app.delete('/platformadmin/allGuests/messages/:messageId', isLoggedIn, isAdministrator, asyncWrapper(async(req, res) => {
  await MessageAssistant.findByIdAndDelete(req.params.messageId);
  req.flash('success', 'Message deleted successfully');
  res.redirect('/platformadmin/allGuests/messages');
  }));

  app.get('/platformadmin/deleteuser/:Id', isLoggedIn, isAdministrator, asyncWrapper(async(req, res) => {
  await User.findByIdAndDelete(req.params.Id);
  req.flash('success', 'User deleted successfully');
  res.redirect('/platformadmin/allusers');
  }));

  app.get('/platformadmin/adddata',isLoggedIn, isAdministrator,(req, res) => {
    res.render('content/adddata', {activeMenuItem: 'adddata',  page:'dashboard'});
  });

    app.post('/platformadmin/adddata',isLoggedIn, isAdministrator, uploadVideo.single('uploadedvideo'),
    asyncWrapper(async(req, res) => {
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
 
   }));

   app.get('/platformadmin/editdata/:id',isLoggedIn, isAdministrator, asyncWrapper(async(req, res) => {
    const data = await Content.findById(req.params.id); 
    const getObjectParams = {
      Bucket: process.env.AmazonS3_Bucket_Name,
      Key: `videos/${data.videoKey}`,
    };
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(S3, command, { expiresIn: 60 * 60 * 2, });
    data.videoUrl = url;
    res.render('content/editdata', {data,  page:'dashboard'})
   }));

   app.put('/platformadmin/editdata/:id',isLoggedIn, isAdministrator,
   uploadVideo.single('uploadedvideo'), asyncWrapper(async(req, res) => {
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
   }));

   app.delete('/platformadmin/deletedata/:videoId',isLoggedIn, isAdministrator, asyncWrapper(async(req, res) => {
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
        
   }));
  app.get('/dashboard/:user/:subject', isLoggedIn, asyncWrapper(async(req, res) => {
    const{subject} = req.params;
    const levels = await Content.find({subject});
    const schoolLevels = [];
    levels.map(level => {
      if(!schoolLevels.includes(level.level)){
        schoolLevels.push(level.level);
      }
    })
    res.render('user/dashboardV2Class', {subjectSelected:subject, schoolLevels,  page:'dashboard'});
  }));

  app.get('/dashboard/:user/:subject/:level', isLoggedIn, asyncWrapper(async(req, res) => {
    const{subject, level} = req.params;
    const terms = await Content.find({subject, level});
    const schoolTerms = [];
    terms.map(term => {
      if(!schoolTerms.includes(term.term)){
        schoolTerms.push(term.term);
      }
    })
    res.render('user/dashboardV2Term', {subjectSelected:subject, levelSelected:level, schoolTerms,  page:'dashboard'});
  }));

  app.get('/dashboard/:user/:subject/:level/:term', isLoggedIn, asyncWrapper(async(req, res) => {
    const {level, subject, term} = req.params;
    const data = await Content.find({level, subject, term});
    const topics =  [];
    data.map(video => {
      if(!topics.includes(video.topic)){
        topics.push(video.topic);
      }
    })
    res.render('user/dashboardV2Topic', {subjectSelected:subject, levelSelected:level, termSelected:term, topics,  page:'dashboard'});
  }));

  app.get('/dashboard/:user/:subject/:level/:term/:topic', isLoggedIn, asyncWrapper(async(req, res) => {
    const {level, subject, term, topic} = req.params;
    const lessons  = await Content.find({subject: subject, level: level, term: term, topic: topic}).sort({lessonNumber: 1});
    res.render('user/dashboardV2Lesson', {subject, level, term, topic, lessons,  page:'dashboard'});
  }));

  app.all('*', (req, res, next) => {
    // next(new AppError('The page was not found', 404));
    if (req.accepts('html')) {
      res.render('404', { url: req.url, page:'404' });
      return;
    }
  
    // respond with json
    if (req.accepts('json')) {
      res.json({ error: 'Not found' });
      return;
    }
  
    // default to plain-text. send()
    res.type('txt').send('Not found');
  })
  
  app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err
    res.status(status).send(message)
  })




    
