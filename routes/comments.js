var express = require('express'),
	router = express.Router({mergeParams: true}),
	middleware = require('./../middleware/index'),
	Campground = require('./../models/campground'),
	Comment = require('./../models/comment');

router.get('/new', middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err) {
			console.log(err);
		} else {
			res.render('comments/new', {campground: campground});
		}
	});
});

router.post('/', middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err) {
			req.flash('error', 'Campground not found!');
			res.redirect('/campgrounds');
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err) {
					req.flash('error', 'Something went wrong! Comment could not be created!');
					res.redirect('/campgrounds/' + campground._id);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash('success', 'Successfully created comment!');
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, comment){
		if(err) {
			req.flash('error', 'Comment not found!');
			res.redirect('back');
		} else {
			Campground.findById(req.params.id, function(err, campground){
				if(err) {
					req.flash('error', 'Campground not found!');
					res.redirect('back');
				} else {
					res.render('comments/edit', {campground: campground, comment: comment});
				}
			});
		}
	});
});

router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
		if(err) {
			req.flash('error', 'Comment not found!');
			res.redirect('back');
		} else {
			req.flash('success', 'Successfully updated comment!');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err, comment){
		if(err) {
			req.flash('error', 'Comment not found!');
			res.redirect('back');
		} else {
			req.flash('success', 'Successfully deleted comment!');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

module.exports = router;