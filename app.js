if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: 'server.env' })
}
const express = require('express'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    path = require('path'),
    methodOverride = require('method-override'),
    expressSsession = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    { v4: uuidv4 } = require('uuid'),
    ejsmate = require('ejs-mate'),
    flash = require('connect-flash'),

    asyncWrapper = require('./utils/asyncWrapper'),

    User = require('./models/user'),
    Payment = require('./models/payment'),
    Content = require('./models/content'),
    userRoutes = require('./routes/user.routes'),
    Flutterwave = require('flutterwave-node-v3'),
    adminRoutes = require('./routes/admin.routes'),
    app = express();

const flw = new Flutterwave(process.env.Flutter_Public_Key, process.env.Flutter_Secret_Key);
    

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
  app.use(async(req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currUser = req.user
    next()
  });

  app.listen(port, () => console.log(`Server is running on port ${port}!`));

  app.get('/', asyncWrapper(async(req, res) => {
    const sampleVideos = await Content.find({cost:'free'});
      res.render('home', {sampleVideos, page:'home'});
  }));

  app.get('/about', (req, res) => {
    res.render('about', {page:'about'});
  });

  app.get('/makepayment', asyncWrapper(async(req, res) => {
   try {
    let subscriptions = []
    if (!req.isAuthenticated()) {
      return res.render('makepayment', {page:'makepayment', subscriptions, currentUser:null} );
    }
    const currentUser = await User.findById(req.user._id).populate({path:'payments', model: Payment, options:{sort:{'createdAt':-1}}});
    if(currentUser){
        if(currentUser.payments.length > 0){
          subscriptions = currentUser.payments;
        }
    }
    res.render('makepayment', {page:'makepayment', subscriptions, currentUser});
    
   } catch (error) {
    console.log(error);
   }
  }));

  app.post('/makepayment', asyncWrapper(async(req, res) => {
    const {phoneNumber, network, country, email} = req.body;
    try {
      const payloadUganda = {
      phone_number: phoneNumber,
      network: network,
      amount: 50000,
      currency: 'UGX',
      email: email,
      tx_ref: uuidv4(),
      }

      const PayloadKenya = {
        phone_number: phoneNumber,
        network: network,
        amount:1800,
        currency: 'KES',
        email: email,
        tx_ref: uuidv4(),
      }

      const payloadRwanda = {
        phone_number: phoneNumber,
        network: network,
        amount: 17000,
        currency: 'RWF',
        email: email,
        tx_ref: uuidv4(),
      }

      if (country.toLowerCase() === 'uganda'){
      const respond = await flw.MobileMoney.uganda(payloadUganda);
      res.status(200).json(JSON.stringify(respond)).end();
      }
       if(country.toLowerCase() === 'kenya'){
      const respond = await flw.MobileMoney.mpesa(PayloadKenya);
      res.status(200).json(JSON.stringify(respond)).end();
      }
      if (country.toLowerCase() === 'rwanda'){
        const respond = await flw.MobileMoney.rwanda(payloadRwanda);
        res.status(200).json(JSON.stringify(respond)).end();
      }
      
    } catch (error) {
      console.log(error);
      res.status(400).json({status:'error'}).end();
    }
  }));

  app.post("/flw-webhook", asyncWrapper(async(req, res) => {
   try {
    const expectedAmount  = 50000;
    const expectedCurrency = 'UGX';
    const secretHash = process.env.Flutter_Secret_Hash;
    const signature = req.headers["verif-hash"];
    if(!signature || signature !== secretHash){
      return res.status(400).json({message: "Invalid Signature"}).end();
    }
    const payload = req.body;
    const data = payload.data;
    const response = await flw.Transaction.verify({id:data.id});
    if(response.status === 'success'){
      let user = await User.find({email: data.customer.email});
      user = user[0];
      let endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      const payment = {
        transactionId: response.data.id,
        paymentAmount: response.data.amount,
        paymentCurrency: response.data.currency,
        status: response.data.status,
        transactionDate: response.data.created_at,
        paymentStartDate: response.data.created_at,
        paymentEndDate: endDate,
        paymentStatus: 'successful',
      }

      const newPayment = new Payment(payment);
      newPayment.user = user;
      user.payments.push(newPayment);
      user.isPremium = true;
      await newPayment.save();
      await user.save();
      return res.status(200).json({message: "Payment Successful"}).end();
      
    }

   } catch (error) {
      console.log(error);
      return res.status(400).json({message: "Payment Failed"}).end();
    
   }
  }));

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




    
