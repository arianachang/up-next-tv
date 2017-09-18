//express setup
const express = require('express');
const app = express();

//csrf setup
const csrf = require('csurf');
const csrfProtection = csrf();
app.use(csrfProtection);

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
		res.redirect('/user/shows');
	} 
});

app.get('/today', (req, res) => {
	res.render('today');
});

app.get('/onair', (req, res) => {
	res.render('onair', {csrfToken: req.csrfToken()});
});

app.post('/onair', (req, res) => {
	const checked = req.body.tv;
	console.log(checked);

	if(!req.user) {
		const errMsg = 'You must be logged in to add shows to your list!'
		res.render('onair', {error: errMsg, csrfToken: req.csrfToken()});
	}
	else {
		if(typeof checked == 'string' || checked instanceof String) {
			User.findOneAndUpdate(
				{username: req.user.username},
				{$addToSet: {shows:Number(checked)}}, (err, user) => {
					if(err) {
						console.log(err);
					}
					else {
						const msg = 'Show successfully added!';
						res.render('user-home', {user: user, msg: msg});
					}
			});
		}
		else {
			const ids = checked.map((id) => {return Number(id);});
			console.log(ids);
			User.findOneAndUpdate(
				{username: req.user.username},
				{$addToSet: {shows: {$each: ids}}}, (err, user) => {
					if(err) {
						console.log(err);
					}
					else {
						const msg = 'Shows successfully added!';
						res.render('user-home', {user: user, msg: msg});
					}
			});
		}
	}
});

module.exports = app;
