//user.js

//express setup
const express = require('express');
const app = express();

//csrf setup
const csrf = require('csurf');
const csrfProtection = csrf();
app.use(csrfProtection);

//passport setup
const passport = require('passport');

//mongoose setup
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Schema.ObjectId;

//retrieve constructor models
const User = mongoose.model("User");

//user routes
app.get('/shows', isLoggedIn, (req, res) => {
	console.log(req.user);
	User.findOne({username: req.user.username}, (err, user) => {
		console.log(user.shows);
		//res.render('user-home', {user:req.user});
	});
});

app.get('/profile', isLoggedIn, (req, res) => {
	res.render('user-profile', {user:req.user});
});

app.get('/logout', isLoggedIn, (req, res) => {
	//logs out the current user
	req.logout();
	res.redirect('/');
});

//middleware to make sure user is not logged in
app.use('/', notLoggedIn, (req, res, next) => {
	next();
});

app.get('/login', (req, res) => {
	res.render('signin', {error: req.flash('error'), csrfToken: req.csrfToken()});
});

app.post('/login',
	passport.authenticate('local', {
		successRedirect: '/user/shows',
		failureRedirect: '/user/login',
		failureFlash: true
	})
);

app.get('/signup', (req, res) => {
	//create an account page
	res.render('signup', {error: req.flash('error'), csrfToken: req.csrfToken()});
});

app.post('/signup', passport.authenticate('signup', {
	successRedirect: '/user/shows',
	failureRedirect: '/user/signup',
	failureFlash : true })
);

module.exports = app;

function isLoggedIn(req, res, next) {
	//middleware for checking if user is logged in
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/user/login');
}

function notLoggedIn(req, res, next) {
	if(!req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}