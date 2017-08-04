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
	res.render('onair');
})

module.exports = app;
