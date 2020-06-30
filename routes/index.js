var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");



router.get("/", function(req, res) {
    res.render("landing")
})

router.get("/register", function(req, res) {
    res.render("register")
})

router.post("/register", function(req, res) {
    User.register(new User({
        username: req.body.username
    }), req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message)
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Hey " + user.username + " How are you?")
                res.redirect("/campgrounds");
            })
        }
    })
})

router.get("/login", function(req, res) {
    res.render("login", { message: req.flash("error") })
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    successFlash: "You have been logged in!",
    failureFlash: "Incorrect username or password"
}), function(req, res) {})


router.get("/logout", function(req, res) {
    req.logOut();
    req.flash("success", "You have been logged out!")
    res.redirect("/campgrounds")
});

module.exports = router;