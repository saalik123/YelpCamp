var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index");
// we don't explicitly need to write /index after middleware because when we create
// a file with the name of index inside a directory,  while including/requiring
// that directory only will implicitly(by itself) require index.js file for us. 



// show all campgrounds
router.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds
            })
        }
    })

})


// show the form to create a new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new")
})


// logic to create a new campground and store it to database
router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var des = req.body.description;
    // var author = { id: req.user.id, username: req.user.username };
    var newCampground = {
        name: name,
        price: price,
        image: image,
        description: des
            // author: author
    };
    Campground.create(newCampground, function(err, newCampground) {
        if (err) {
            req.flash("error", "Something went wrong!")
        } else {
            // associate/pin the newly created campground to the user.
            newCampground.author.id = req.user.id;
            newCampground.author.username = req.user.username;
            newCampground.save();
            req.flash("success", "You added a campground to YelpCamp!")
            res.redirect("/campgrounds");
        }
    })
})


// show the details of a specific campground
router.get("/campgrounds/:id", function(req, res) {
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err, campground) {
        // check for error or campground(is campground found or is empty)
        if (err || !campground) {
            req.flash("error", "Campground not found!")
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show", {
                campground: campground
            })
        }
    })
});


// show the form to edit the campground
router.get("/campgrounds/:id/edit", middleware.campgroundAuthorization, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        // check for error or campground(is campground found or is empty)
        if (err || !foundCampground) {
            req.flash("error", "Campground not found!");
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {
                campground: foundCampground
            });
        }
    })
});

// logic to edit/update the campground
router.put("/campgrounds/:id", middleware.campgroundAuthorization, function(req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var des = req.body.description;
    var updateCampground = {
        name: name,
        price: price,
        image: image,
        description: des
    }
    Campground.findByIdAndUpdate(req.params.id, updateCampground, function(err, updatedCampground) {
        if (err) {
            req.flash("error", "Something went wrong!")
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground updated successfully!")
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// delete the campground
router.delete("/campgrounds/:id", middleware.campgroundAuthorization, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            req.flash("success", "You deleted a campground!")
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;