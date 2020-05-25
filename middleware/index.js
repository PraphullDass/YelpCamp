var Comment = require('./../models/comment'),
	Campground = require('./../models/campground');

var middlewareObj = {};

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, comment) {
			if(err) {
				req.flash('error', 'Comment not found!');
				res.redirect('back');
			} else {
				if(comment.author.id.equals(req.user._id)) {
					return next();
				} else {
					req.flash('error', "You don't have permission to do that!");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You need to be logged in to do that!');
		res.redirect('back');
	}
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, campground) {
			if(err) {
				req.flash('error', 'Campground not found!');
				res.redirect('back');
			} else {
				if(campground.author.id.equals(req.user._id)) {
					return next();
				} else {
					req.flash('error', "You don't have permission to do that!");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You need to be logged in to do that!');
		res.redirect('back');
	}
	
}

middlewareObj.isLoggedIn =  function(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error', 'You need to be logged in to do that!');
		res.redirect('/login');
	}
}

module.exports = middlewareObj;