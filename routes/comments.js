var express = require("express");
var router = express.Router(); // {mergeParams: true}
var Comment = require("../models/comment");
var Campground = require("../models/campground");
var middleware = require("../middleware/index");



// shows the form to create a comment
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        // check for error and campground
        if (err || !foundCampground) {
            req.flash("error", "Campground not found!")
            res.redirect("/campgrounds")
        } else {
            res.render("comments/new", {
                campground: foundCampground
            });
        }
    })

})

// logic to create a new comment
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res) {
    // create a new comment.
    var text = req.body.text;
    var author = req.body.author;
    var newComment = {
        text: text,
        author: author
    };
    Comment.create(newComment, function(err, comment) {
        if (err) {
            req.flash("error", "Something went wrong!")
            console.log(err);
        } else {
            // find a particular campground.
            Campground.findById(req.params.id, function(err, foundCampground) {
                // check for error or campground(is campground found or is empty)
                if (err || !foundCampground) {
                    req.flash("error", "Something went wrong!")
                    res.redirect("/campgrounds")
                } else {
                    // associate/pin a comment to a specific user.
                    // add username and id to author field of comment model.
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    comment.save();
                    // add/push the created comment to campground.
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    req.flash("success", "You commented on " + foundCampground.name)
                    res.redirect("/campgrounds/" + foundCampground.id);
                }
            })
        }
    })
});

// shows the form to edit/update a particular comment.
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.commentAuthorization, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        // check for error or campground(is campground found or is empty)
        if (err || !foundCampground) {
            req.flash("error", "Campground not found!");
            res.redirect("/campgrounds");
        } else {
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                // check for error or comment(is comment found or is empty)
                if (err || !foundComment) {
                    req.flash("error", "Something went wrong!")
                    res.redirect("/campgrounds" + req.params.id)
                } else {
                    res.render("comments/edit", {
                        comment: foundComment,
                        campground_id: req.params.id
                    });
                }
            });
        }
    })
})


// logic to edit/update a particular comment
router.put("/campgrounds/:id/comments/:comment_id", middleware.commentAuthorization, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body, function(err, updatedComment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment edited successfully!")
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// delete a particular comment
router.delete("/campgrounds/:id/comments/:comment_id", middleware.commentAuthorization, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "You deleted a comment!")
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

module.exports = router;