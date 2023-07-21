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

    asyncWrapper = require('./utils/asyncWrapper'),
    AppError = require('./utils/appError'),
    {upladimage, uploadVideo} = require('./config/fileUploder'),
    {getVideo} = require('./config/fileGetter'),

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
      secret: 'tampernot',
      resave: false,
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

    app.post('/platformadmin/adddata', uploadVideo.single('uploadedvideo'), asyncWrapper(async(req, res) => {
      console.log(req.file);
      console.log(req.body);
      res.send('done')
    }));
