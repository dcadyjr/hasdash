var express = require("express"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	User = require("../models/User"),
	session = require("express-session"),
	bcrypt = require("bcrypt"),
	twitter = require("../twitter_api.js"),
	tweetToHTML = require('tweet-to-html');




router.use(bodyParser.urlencoded({extended: true}));

router.get("/", function(req, res) {
	User.find(function(err, users) {
		var renderObject = {users: users};

		twitter.getSearch({'q':'#cubs','count': 10}, function(){} , function(data){
			
			tweets = JSON.parse(data);

			for (var i = 0; i < tweets.statuses.length; i++){

			var userScreenName = tweets.statuses[i].user.screen_name;
			var tweetId = tweets.statuses[i].id_str;
			
			console.log(userScreenName);
			console.log(tweetId);
			
			}
			res.send(data);
		})
		

		// res.render("userlist", renderObject);

	})

});

router.get("/:id", function(req, res) {
	User.findById(req.params.id).populate("hashtags").exec(function(err, user) {
		var renderObject = {user: user};
		res.render("dashboard", renderObject)
	});
});

router.post("/", function(req, res) {
	bcrypt.hash(req.body.password, 10, function(err, hash) {
		var user = new User({
			name: req.body.name,
			password: hash,
			email: req.body.email
		});
		user.save();
		res.send(user);
	})
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



module.exports = router;