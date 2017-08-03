//app.js

//express setup
const express = require('express');
const app = express();

//body parser setup
const bodyParser = require('body-parser'); //require body-parser midware to access request body
app.use(bodyParser.urlencoded({extended: false}));

//static files set up
const path = require('path');
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath)); //serve up static files anywhere

//hbs setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); //bring in handlebars for templating

//sessions setup
const session = require('express-session');
const sessionOptions = {
	secret: require('crypto').randomBytes(64).toString('hex'),
	resave: false,
	saveUninitialized: true
};
app.use(session(sessionOptions));

//bcrypt setup
const bcrypt = require('bcrypt');

//flash middleware setup
var flash = require('connect-flash');
app.use(flash());

//passport setup
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, {'message':'Incorrect username.'});
      }
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
		if(err) {
			console.log(err);
		}
		if(!passwordMatch) {
			console.log('incorrect pw');
			return done(null, false, {'message':'Incorrect password.'});
		}
		return done(null, user);
	}); //end bcrypt compare
    });
  }
));
passport.use('signup', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    findOrCreateUser = function(){
      // find a user in Mongo with provided username
      User.findOne({'username':username},function(err, user) {
        // In case of any error return
        if (err){
          console.log('Error in Sign Up: ' + err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists');
          return done(null, false, 
             {'message':'User already exists.'});
        } else {
          // create the user & set user's local credentials
          var newUser = new User();
          // set the user's local credentials
          newUser.username = username;

          //check if pw is greater than 8 chars
          if(password.length < 8) {
          	return done(null, false, {'message': 'Password must be at least 8 characters'});
          }
          else {
			bcrypt.hash(password, 10, (err, hash) => {
				if(err) {
					console.log(err);
				}
				newUser.password = hash;

				// save the user
	            newUser.save(function(err) {
	            	if (err){
	             		console.log('Error in Saving User: ' + err);  
	              	throw err;  
	            }
	            console.log('User Registration Successful');    
	            return done(null, newUser);
	            });
			});//end bcrypt hash
          }
        }//end else
      });//end findOne
    };
     
    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

//init connection to db
require('./db');

//mongoose setup
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Schema.ObjectId;

//retrieve constructor models
const User = mongoose.model("User");

//route handlers
app.get('/', function(req, res) {
	if(!req.user) {
		//if user not signed in, go to home page
		//res.render('signin', {error: req.flash('error')});
		res.redirect('/today');
	}
	else {
		//res.render('homepage', {user:req.user});
		res.redirect('/mytvshows');
	} 
});

app.get('/login', (req, res) => {
	res.render('signin', {error: req.flash('error')});
});

app.post('/login', (req, res) => {
	passport.authenticate('local', {
		successRedirect: '/mytvshows',
		failureRedirect: '/',
		failureFlash: true
	});
});

app.get('/signup', (req, res) => {
	//create an account page
	res.render('signup', {error: req.flash('error')});
});

app.post('/signup', passport.authenticate('signup', {
	successRedirect: '/mytvshows',
	failureRedirect: '/signup',
	failureFlash : true })
);

app.get('/mytvshows', (req, res) => {
	if(!req.user) {
		//go to login form
		res.redirect('/login');
	}
	else {
		res.render('mytvshows', {user:req.user});
	}
});

app.get('/today', (req, res) => {
	res.render('today');
});

app.get('/onair', (req, res) => {
	res.render('onair');
})

app.get('/logout', (req, res) => {
	//logs out the current user
	req.logout();
	res.redirect('/');
});

app.get('*', (req, res) => {
	//handles 404 page not found
	res.render('error', {msg:res.status});
});

//listen on port 3000
app.listen(process.env.PORT || 3000);