
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

    User = require('./models/user'),
    Content = require('./models/content'),
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
    const sampleVideos = await Content.find({cost:'free'});
      res.render('home', {sampleVideos, page:'home'});
  }));

  app.get('/about', (req, res) => {
    res.render('about', {page:'about'});
  });

  app.get('/makepayment', (req, res) => {
    res.render('makepayment', {page:'makepayment'});
  });

  app.get('/guide', (req, res) => {
    res.render('guide',{page:'guide'});
  });

  app.use('/', userRoutes);
  app.use('/platformadmin', adminRoutes);

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




    
