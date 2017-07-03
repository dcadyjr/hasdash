var express = require("express"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	User = require("../models/User"),
	session = require("express-session"),
	bcrypt = require("bcrypt"),
	twitter = require("../twitter_api.js"),
	tweetToHTML = require('tweet-to-html');




router.use(bodyParser.urlencoded({extended: true}));

router.get("/search", function(req, res){

	twitter.getSearch({'q':'#cubs','count': 10}, function(){} , function(data){//this is the search to get tweet data.
			
			tweets = JSON.parse(data);//this allows us to dig into the tweet data

			for (var i = 0; i < tweets.statuses.length; i++){//this loops through each tweet and grabs the userScreenName and tweetId

			var userScreenName = tweets.statuses[i].user.screen_name;//variable to hold the UserScreenName
			var tweetId = tweets.statuses[i].id_str;//variable to hold the tweet Id
			
				$.ajax({
					method: "GET",
					url: "https://publish.twitter.com/oembed?url=https%3A%2F%2Ftwitter.com%2Fedent%2Fstatus%2F860905721646338048",
					success: function(response){
						console.log(response);
					}	
				});


			console.log(userScreenName);
			console.log(tweetId);
			
			}
			res.send(data);
		})
})


router.get("/", function(req, res) {

	User.find(function(err, users) {
		var renderObject = {users: users};

		res.render("userlist", renderObject);
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