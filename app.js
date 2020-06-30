// require("dotenv").config()

var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    expressSession = require("express-session"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    moment = require("moment"),


    var app = express();
var seedDB = require("./seed");

mongoose.connect("mongodb+srv://saalik123:saalik@123@cluster0.9plmk.mongodb.net/saalik123?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

// seedDB();

// >>>>>>>>>>>>>>> MODELS <<<<<<<<<<<<<<<<
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");

app.locals.moment = moment;
// Now moment is available for use in all of your view files via the variable named moment

// >>>>>>>>>>>>>>> PASSPORT SETUP <<<<<<<<<<<<<<<<<<<<<



app.use(expressSession({
    secret: "Everyone should learn to code.",
    resave: false,
    saveUninitialized: true
}));

app.use(function(req, res, next) {
    if (!req.session) {
        return next(new Error('Oh no')) //handle error
    }
    next() //otherwise continue
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// >>>>>>>>>>>>>>>>>>> ROUTES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// ROUTES FOR CAMPGROUNDS
var campRoutes = require("./routes/campgrounds");
app.use(campRoutes);

// ROUTES FOR COMMENTS.
var commentRoutes = require("./routes/comments");
app.use(commentRoutes);

// ROUTES FOR AUTHENTICATION.
var indexRoutes = require("./routes/index");
app.use(indexRoutes);


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

app.listen(process.env.PORT, function() {
    console.log("STARTING SERVER AT PORT 3000.....!")
})