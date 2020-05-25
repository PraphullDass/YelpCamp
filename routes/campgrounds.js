var express = require('express'),
	router = express.Router(),
	middleware = require('./../middleware/index.js'),
	Campground = require('./../models/campground');

router.get("/", function(req, res) {
	Campground.find({}, function(err, campgrounds){
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds});
		}
	});
});

router.post("/", middleware.isLoggedIn, function(req, res) {
	Campground.create({
			author: {
				id: req.user._id,
				username: req.user.username
			},
			name: req.body.name,
			image: req.body.image,
			description: req.body.description,
			price: req.body.price
		}, function(err, campground){
			if(err) {
				console.log(err);
			} else {
				req.flash('success', 'Successfully created Campground!');
				res.redirect("/campgrounds");
			}
		});
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});

router.get("/:id", function(req, res) {
	Campground.findById(req.params.id).populate('comments').exec(function(err, campground) {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: campground});
		}
	});
});

router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/edit", {campground: campground});
		}
	});
});

router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground) {
		if(err) {
			req.flash('error', 'Something went wrong! Campground could not be created!');
			res.redirect('/campgrounds');
		} else {
			req.flash('success', 'Successfully updated Campground!');
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err, campground){
		if(err) {
			req.flash('error', 'Campground not found!');
			res.redirect('/campgrounds');
		} else {
			req.flash('success', 'Successfully deleted Campground!');
			res.redirect('/campgrounds');
		}
	});
});

module.exports = router;