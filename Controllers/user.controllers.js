const  asyncWrapper = require('../utils/asyncWrapper');
    
    
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

module.exports = {
    getLogin,
    postLogin,
    getRegister,
    postRegister,
    getLogout
}
