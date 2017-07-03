var express = require("express"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	User = require("../models/User"),
	session = require("express-session"),
	bcrypt = require("bcrypt"),
	twitter = require("../twitter_api.js"),
	tweetToHTML = require('tweet-to-html');



router.use(bodyParser.urlencoded({extended: true}));

// get login page
router.get("/login", function(req, res) {
	res.render("login");
});

// log out
router.get("/logout", function(req, res) {
	req.session.loggedIn = false;
	res.render("logout");
});

router.get("/register", function(req, res) {
	res.render("register");
});

// login with information
router.post("/login", function(req, res) {
	User.findOne({email: req.body.email}, function(err, user) {
		if (user) {
			bcrypt.compare(req.body.password, user.password, function(err, match) {
				if (match === true) {
					req.session.loggedIn = true;
					req.session.myId = user._id;
					res.redirect("/users/" + user._id);
				} else {
					res.send("password incorrect"); // password was wrong
				}
			});
		} else {
			res.send("couldn't find that email address") // email not found
		};
	});
});

router.get("/", function(req, res) {
	if (req.session.loggedIn === true) {
		User.find(function(err, users) {
			var renderObject = {
				users: users,
				session: req.session
			};

			twitter.getSearch({'q':'#cubs','count': 10}, function(){} , function(data){
				obj = JSON.parse(data);
				// console.log(obj.statuses[0].extended_entities);
				var results = tweetToHTML.parse(obj.statuses);
				console.log(results[0].html);
				res.send(data);
			});
			// res.render("userlist", renderObject);
		})
	} else {
		res.redirect("/");
	};
});

// just for testing since GET to /users/ no longer lists all the users
router.get("/listofusers", function(req, res) {
	User.find(function(err, users) {
		var renderObject = {
			users: users
		};
		res.json(renderObject);
	});
});

router.get("/:id", function(req, res) {
	if (req.session.loggedIn === true) {
		User.findById(req.params.id).populate("hashtags").exec(function(err, user) {
			var renderObject = {
				user: user,
				session: req.session
			};
			res.render("dashboard", renderObject)
		});
	} else {
		res.redirect("/");
	};
});

router.post("/", function(req, res) {
	bcrypt.hash(req.body.password, 10, function(err, hash) {
		var user = new User({
			name: req.body.name,
			password: hash,
			email: req.body.email
		});
		user.save();
		req.session.loggedIn = true;
		req.session.myId = user._id;
		// couldn't get this to redirect correctly so it's handled in main.js
		res.json(user._id);
	});
});

router.patch("/:id", function(req, res) {
	if (req.body.password) {
		bcrypt.hash(req.body.password, 10, function(err, hash) {
			req.body.password = hash;
			User.update({_id: req.params.id}, req.body, function(err, user) {
				User.findById(req.params.id, function(err, user) {
					res.json(user);
				});
			});
		})
	} else {
		User.update({_id: req.params.id}, req.body, function(err, user) {
			User.findById(req.params.id, function(err, user) {
				res.json(user);
			});
		});
	};
});

router.delete("/:id", function(req, res) {
	User.findByIdAndRemove(req.params.id, function(err, user) {
		res.json("success");
	});
});

// router.patch("/twitter", function(req, res){
// 	twitter.getSearch({'q':'#haiku','count': 10}, error, success);
// 		console.log(success);
// });

module.exports = router;