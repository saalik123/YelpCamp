// The seeds file will empty our database and add new(dummy) data to our database
// every time the server is run. It gives/provides us some data to work with. 

var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");


var seedData = [{
        name: "Salmon Creek",
        image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&h=350",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as t"
    },
    {
        name: "Granite Hill",
        image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as t"
    },
    {
        name: "Mountain Goat's Rest",
        image: "https://images.pexels.com/photos/1539225/pexels-photo-1539225.jpeg?auto=compress&cs=tinysrgb&h=350",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as t"
    },
    {
        name: "Salmon Creek",
        image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&h=350",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as t"
    }, {
        name: "Granite Hill",
        image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as t"
    }, {
        name: "Mountain Goat's Rest",
        image: "https://images.pexels.com/photos/1539225/pexels-photo-1539225.jpeg?auto=compress&cs=tinysrgb&h=350",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as t"
    },
    {
        name: "Salmon Creek",
        image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&h=350",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as t"
    }, {
        name: "Granite Hill",
        image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as t"
    }, {
        name: "Mountain Goat's Rest",
        image: "https://images.pexels.com/photos/1539225/pexels-photo-1539225.jpeg?auto=compress&cs=tinysrgb&h=350",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as t"
    }
]

function seedDB() {
    // remove campgrounds from database
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Removing Campgrounds...!")

            // remove comments from database
            Comment.remove({}, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Removing Comments....!");
                }
            })

            // add new campgrounds(seedData) to database
            seedData.forEach(function(campground) {
                Campground.create(campground, function(err, campground) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Adding Campground...!")
                            // create a new comment
                        Comment.create({
                            text: "It's an awesome place to visit.",
                            author: "Colt"
                        }, function(err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Adding Comment....!");
                                // add/push the created comment to campground.
                                campground.comments.push(comment);
                                campground.save();

                            }
                        })
                    }
                })
            })
        }
    })

}

module.exports = seedDB;