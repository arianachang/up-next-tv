//express setup
const express = require('express');
const app = express();

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
		res.render('signin', {error: errMsg, csrfToken: req.csrfToken()});
	}
	else {
		//update user tv shows
		if(typeof checked === Array) {
			checked.forEach((movieId) => {
				User.findOneAndUpdate(
					{username: req.user.username},
					{$push: {shows:movieId}}, (err, user) => {
						if(err) {
							console.log(err);
						}
						else {
							const msg = 'Shows successfully added!';
							res.redirect('/user/shows', {msg: msg});
						}
				});
			});
		}
		else {
				User.findOneAndUpdate(
					{username: req.user.username},
					{$push: {shows:checked}}, (err, user) => {
						if(err) {
							console.log(err);
						}
						else {
							const msg = 'Show successfully added!';
							res.redirect('/user/shows', {msg: msg});
						}
				});
		}
	}
});

module.exports = app;
