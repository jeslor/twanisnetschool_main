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
    AppError = require('./utils/appError'),
    {upladimage, uploadVideo} = require('./config/videoUploder'),
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
  })




  app.listen(3000, () => console.log(`Server is running on port ${port}!`));
      app.get('/', (req, res) => {
          res.render('home');
      });



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
      res.render('user/login');
    }
    );

    app.get('/register', (req, res) => {
      res.render('user/register');
    })

    app.get('/about', (req, res) => {
      res.render('about');
    });

    app.get('/platformadmin/adddata', (req, res) => {
      res.render('content/adddata');
    });

    app.get('/dashboard/:user', asyncWrapper(async(req, res) => {
      const data = await Content.find({});
      res.render('user/dashboard', {data});

    }));

    app.post('/platformadmin/adddata', uploadVideo.single('uploadedvideo'),
     asyncWrapper(async(req, res) => {
      let newVideo  = new Content({
        title: req.body.title,
        cost: req.body.cost,
        level: req.body.level,
        subject: req.body.subject,
        videoKey: req.file.key,
        videoSize: Number(req.file.size),
        viewedTimes: 0
    
      });
      await newVideo.save();
      req.flash('success', 'Video added successfully');
      res.redirect('/platformadmin/adddata');
    }));

    app.get('/platformadmin/editdata/:id', asyncWrapper(async(req, res) => {
      const data = await Content.findById(req.params.id); 
      res.render('content/editdata', {data})
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
    
    
