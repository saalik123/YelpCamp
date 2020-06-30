// All MIDDLEWARE goes here!
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("error", "You need to be logged in to do that!")
        res.redirect("/login");
    }
};


middlewareObj.campgroundAuthorization = function(req, res, next) {
    // check if the user is logged in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            // check for error or campground(is campground found or is empty)
            if (err || !foundCampground) {
                req.flash("error", "Campground not found!")
                res.redirect("/campgrounds");
            } else {
                // check if the current logged in user is the author/creator of the given/specific campground
                if (foundCampground.author.id.equals(req.user.id)) {
                    next();
                } else {
                    req.flash("error", "Permission Denied!")
                    res.redirect("back");
                }

            }
        });

    } else {
        req.flash("error", "You need to be logged in to do that!")
        res.redirect("/login");
    }
};

middlewareObj.commentAuthorization = function(req, res, next) {
    // check if the user is logged in
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            // check for error or comment(is comment found or is empty)
            if (err || !foundComment) {
                req.flash("error", "Comment not found!")
                res.redirect("/campgrounds");
            } else {
                // check if the current logged in user is the author of the given/specific comment
                if (foundComment.author.id.equals(req.user.id)) {
                    // run the next code.
                    next();
                } else {
                    req.flash("error", "Permission Denied!")
                    res.redirect("back");
                }
            }
        })
    } else {
        res.redirect("back");
    };
};




module.exports = middlewareObj;