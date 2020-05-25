var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	mongoose = require("mongoose"),
	methodOverride = require('method-override'),
	flash = require('connect-flash'),
	Campground = require('./models/campground'),
	seedDB = require('./seeds'),
	Comment = require('./models/comment'),
	User = require('./models/user');

var campgroundRoutes = require('./routes/campgrounds'),
	commentRoutes = require('./routes/comments'),
	indexRoutes = require('./routes/index');

app.set("view engine", "ejs");
app.use('/static', express.static("public"));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());

// mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect("mongodb+srv://praphull:YsY64TbmTcbuubA8@yelpcamp-crek2.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

// seedDB();

// Passport configuration
app.use(require('express-session')({
	secret: 'This is a secret',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP);
// app.listen(8888, function(){
// 	console.log("Server started");
// });