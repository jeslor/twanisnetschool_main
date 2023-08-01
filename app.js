const { log } = require('console');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '/server.env' })
}
const express = require('express'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    favicon = require('serve-favicon'),
    path = require('path'),
    methodOverride = require('method-override'),
    expressSsession = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    ejsmate = require('ejs-mate'),
    flash = require('connect-flash'),
    fs = require('fs'),
    asyncWrapper = require('./utils/asyncWrapper'),
    AWS  = require('aws-sdk'),
    AppError = require('./utils/appError'),
    {upladimage, uploadVideo} = require('./config/videoUploder'),
    {isLoggedIn, isAdministrator} =require('./middleware/userMiddleware'),
    {getVideo} = require('./config/videoGetter'),

    User = require('./models/user'),
    Content = require('./models/content'),
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
  // app.use(favicon(__dirname + '/public/images/favicon/favicon.ico'))
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


  const s3 = new AWS.S3({
    accessKeyId: process.env.AmazonS3_Access_Key_ID,
    secretAccessKey: process.env.AmazonS3_Secret_Access_Key,
    region: process.env.AmazonS3_Region,
  })




  app.listen(3000, () => console.log(`Server is running on port ${port}!`));


      app.get('/', asyncWrapper(async(req, res) => {
        const sampleVideos = await Content.find({cost:'free'}).limit(4);
          res.render('home', {sampleVideos});
      }));



      // app.get('/videocomponent', (req, res) => {
      //   console.log('reached here');
        // const range = req.headers.range
        // const videoPath = './samplevideos/sample-5s.mp4';
        // const videoSize = fs.statSync(videoPath).size
        // console.log(videoSize);
        // const chunkSize = 1 * 1e6;
        // const start = Number(range.replace(/\D/g, ""))
        // const end = Math.min(start + chunkSize, videoSize - 1)
        // const contentLength = end - start + 1;
        // const headers = {
        //     "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        //     "Accept-Ranges": "bytes",
        //     "Content-Length": contentLength,
        //     "Content-Type": "video/mp4"
        // }
        // res.writeHead(206, headers)
        // const stream = fs.createReadStream(videoPath, {
        //     start,
        //     end
        // })
        // stream.pipe(res)
        // const videoKey = req.params.id;
        // const videoStream = getVideo(videoKey);
        // console.log(videoStream);
        // videoStream.pipe(res);
      // });

    app.get('/login', (req, res) => {
      if(req.isAuthenticated()){ 
        return res.redirect(`/dashboard/${req.user.username}`)};
      res.render('user/login');
      }
    );

    app.post('/login', passport.authenticate('local',
     { failureFlash: true, failureRedirect: '/login' }), 
     (req, res) => {
      req.flash('success', 'Welcome back!');
      res.redirect(`/dashboard/${req.user.username}`);
    });

    app.get('/register', (req, res) => {
      if(req.isAuthenticated()){ 
        return res.redirect(`/dashboard/${req.user.username}`)};
      res.render('user/register');
    });

    app.post('/register', asyncWrapper(async(req, res) => {
      console.log(req.body);
      try {
        const {username, email, password} = req.body;
        const registerUser = new User({username, email});
        const registeredUser = await User.register(registerUser, password);
        req.login(registeredUser, err => {
          if (err) return next(err);
          req.flash('success', 'Welcome to Twanis Net School');
          res.redirect(`/dashboard/${registeredUser.username}`);
        });
      } catch (error) {
        res.redirect('/register');
      }
    })); 

    app.get('/logout', (req, res) => {
      req.logout((err)=>{
        if(err) return next(err);
      });
      req.flash('success', 'Goodbye!');
      res.redirect('/');
    })



    app.get('/about', (req, res) => {
      res.render('about');
    });

    app.post('/searchInput', asyncWrapper(async(req, res) => {
      const {searchSuggestion} = req.body;
      const data = await Content.find({$text: {$search: searchSuggestion}}, {score: {$meta: 'textScore'}}).sort({score: {$meta: 'textScore'}}).limit(7);
      const suggestions = data.map(video => video.title);
      res.send(suggestions);
    }));


    app.get('/videoplayer/:fileId', asyncWrapper(async(req, res) => {
      const videoFileDocuent = await Content.findById(req.params.fileId);
        // const range = req.headers.range
        // if (!range) {
        //     res.status(400).send("Requires Range header");
        // }
        const videoKey = videoFileDocuent.videoKey;
        // const videoSize = videoFileDocuent.videoSize;
        // const chunkSize = 1 * 1e6;
        // const start = Number(range.replace(/\D/g, ""))
        // const end = Math.min(start + chunkSize, videoSize - 1)
        // const contentLength = end - start + 1;
        // const headers = {
        //     "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        //     "Accept-Ranges": "bytes",
        //     "Content-Length": contentLength,
        //     "Content-Type": "video/mp4"
        // }
        // res.writeHead(206, headers)

        const videoStream = getVideo(videoKey);

        // const stream = fs.createReadStream(videoKey, {
        //     start,
        //     end
        // })
        // stream.pipe(res)

       
        videoStream.pipe(res);
    }))

    app.get('/dashboard/subscriptions/video/playnow/:videoID', isLoggedIn, asyncWrapper(async(req, res) => {
  
      const data = await Content.findById(req.params.videoID);
      let similarVideos = await Content.find({topic:data.topic})
      similarVideos = similarVideos.filter(video => video.id !== req.params.videoID);
      res.render('content/viewdata', {data, similarVideos});
     }))

     app.get('/dashboard/free/video/playnow/:videoID', asyncWrapper(async(req, res) => {
       const data = await Content.findById(req.params.videoID);
       let similarVideos = (await Content.find({topic:data.topic}))
       similarVideos = similarVideos.filter(video => {
        return video.id !== req.params.videoID
       });
      res.render('content/viewdata', {data, similarVideos});
     }))

    app.get('/dashboard/:user',isLoggedIn, asyncWrapper(async(req, res) => {
      const {search} = req.query;
     if (search) {
      const data = await Content.find({$text: {$search: search}}, {score: {$meta: 'textScore'}}).sort({score: {$meta: 'textScore'}});
      const {username, email} = req.user;
      if(username==='0775527077' && email ==='twaninetschool@gmail.com'){
        res.render('user/adminDashboard', {data, isAllUsers: false, level:'dummy', subject:'english', activeMenuItem: 'dashboard', resultdescription:`${search}`});
      }else{
        res.render('user/dashboard', {data, level:'dummy', subject:'english', activeMenuItem: 'dashboard', resultdescription:`${search}`});
      }
     }else{
      const data = await Content.find({});
      const {username, email} = req.user;
      if(username==='0775527077' && email ==='twaninetschool@gmail.com' ){
        res.render('user/adminDashboard', {data, isAllUsers: false, level:'senior one', subject:'english', activeMenuItem: 'dashboard', resultdescription:''});
      }else{
        res.render('user/dashboard', {data, level:'dummy', subject:'english', activeMenuItem: 'dashboard',resultdescription:''});
      }
     }
     
    }));


    app.get('/platformadmin/allusers', isLoggedIn, isAdministrator, asyncWrapper(async(req, res) => {
      const users = await User.find({});
      res.render('user/adminDashboard', {data: users, isAllUsers: true, activeMenuItem: 'allUsers', subject:'english', level:'senior one', resultdescription:''});
     }));

    app.get('/platformadmin/adddata',isLoggedIn, isAdministrator,(req, res) => {
      res.render('content/adddata', {activeMenuItem: 'adddata'});
    });

    app.post('/platformadmin/adddata',isLoggedIn, isAdministrator, uploadVideo.single('uploadedvideo'),
    asyncWrapper(async(req, res) => {
     let newVideo  = new Content({
       title: req.body.title,
       cost: req.body.cost,
       level: req.body.level,
       subject: req.body.subject,
       topic: req.body.topic,
       videoKey: req.file.key,
       videoSize: Number(req.file.size),
       viewedTimes: 0
   
     });

     await newVideo.save();
     req.flash('success', 'Video added successfully');
     res.redirect('/platformadmin/adddata');
   }));

   app.get('/platformadmin/editdata/:id',isLoggedIn, isAdministrator, asyncWrapper(async(req, res) => {
    const data = await Content.findById(req.params.id); 
    res.render('content/editdata', {data})
   }));

   app.put('/platformadmin/editdata/:id',isLoggedIn, isAdministrator,
   uploadVideo.single('uploadedvideo'), asyncWrapper(async(req, res) => {
    const {id} = req.params;
    const {body, file} = req;
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

    
    app.get('/fovarites/:userId/:videoId', isLoggedIn, asyncWrapper(async(req, res) => {
      const {userID, videoId} = req.params;
      console.log(userID, videoId);
    }));

    app.get('/dashboard/:user/:subject/:level', isLoggedIn, asyncWrapper(async(req, res) => {
      const {search} = req.query;
      const {subject, level} = req.params;
      if (search) {
        const data = await Content.find({$text: {$search: search}, subject: subject, level: level}, {score: {$meta: 'textScore'}}).sort({score: {$meta: 'textScore'}});
        console.log(data);
        const {username, email} = req.user;
        if (username==='0775527077' && email ==='twaninetschool@gmail.com') {
          res.render('user/adminDashboard', {data, isAllUsers: false, subject, level, activeMenuItem: '', resultdescription:`${subject}, ${level}, ${search}`});
        }else{
          res.render('user/dashboard', {data, subject, level, activeMenuItem: '', resultdescription:`${subject}, ${level}, ${search}`});
        }    
      }else{   
        const data = await Content.find({subject: subject, level: level});
        if(req.user.username==='0775527077' && req.user.email ==='twaninetschool@gmail.com' ){
          res.render('user/adminDashboard', {data, isAllUsers: false, subject, level, activeMenuItem: '', resultdescription:''});
        }else{
          res.render('user/dashboard', {data, subject, level, activeMenuItem: '', resultdescription:''});
        }
      }


    }));

    app.all('*', (req, res, next) => {
      // next(new AppError('The page was not found', 404));
      if (req.accepts('html')) {
        res.render('404', { url: req.url });
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




    
