//db.js

//mongoose setup
const mongoose = require('mongoose');

//define movie schema
const Show = new mongoose.Schema({
	name: {type: String},
	id: {type: Number, required: true}
});

//define user schema
const User = new mongoose.Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	shows: [Number]
});

//register/define the models
mongoose.model("Show", Show);
mongoose.model("User", User);

// is the environment variable, NODE_ENV, set to PRODUCTION? 
if (process.env.NODE_ENV === 'PRODUCTION') {
	//if we're in PRODUCTION mode, then read the configration from a file
	// use blocking file io to do this...
	var fs = require('fs');
	var path = require('path');
	var fn = path.join(__dirname, 'config.json');
	var data = fs.readFileSync(fn);

	// our configuration file will be in json, so parse it and set the
	// conenction string appropriately!
	var conf = JSON.parse(data);
	var dbconf = conf.dbconf;
} else {
	// if we're not in PRODUCTION mode, then use
	dbconf = 'mongodb://localhost/upnexttv';
}

//connect to the database
mongoose.connect(dbconf);