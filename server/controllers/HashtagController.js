var express = require("express"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	Hashtag = require("../models/Hashtag"),
	User = require("../models/User"),
	session = require("express-session"),
	bcrypt = require("bcrypt"),
	twitter = require("../twitter_api.js"),
	tweetToHTML = require('tweet-to-html');


//this is something I was trying when I was working on the ajax.
// var jsdom = require("jsdom").jsdom; 
// jsdom.env("", function(err, window) {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     global.$ = require("jquery")(window);
// })	

router.use(bodyParser.urlencoded({extended: true}));

router.get("/search", function(req, res){
	
	twitter.getSearch({'q':'#cubs','count': 10}, function(){} , function(data){//this is the search to get tweet data.
			
		tweets = JSON.parse(data);//this allows us to dig into the tweet data

		for (var i = 0; i < tweets.statuses.length; i++){//this loops through each tweet and grabs the userScreenName and tweetId

			var userScreenName = tweets.statuses[i].user.screen_name;//variable to hold the UserScreenName
			var tweetId = tweets.statuses[i].id_str;//variable to hold the tweet Id
			
			// $.ajax({//this isn't working I get an error that "$.ajax" is not a function
			// 	method: "GET",
			// 	url: "https://publish.twitter.com/oembed?url=https%3A%2F%2Ftwitter.com%2Fedent%2Fstatus%2F860905721646338048",
			// 	success: function(response){
			// 		console.log(response);
			// 	}	
			// });

			console.log(userScreenName);
			console.log(tweetId);
			
		}
			res.send(data);
	})
})

router.get("/", function(req, res) {
	Hashtag.find(function(err, hashtags) {
		var renderObject = {hashtags: hashtags};
		res.send(renderObject);
	});
});

router.get("/:id", function(req, res) {
	Hashtag.findById(req.params.id, function(err, hashtag) {
		res.send(hashtag);
	});
});

router.post("/", function(req, res) {
	var hashtag = new Hashtag({
		name: req.body.name,
		user: req.body.user,
	});
	hashtag.save();
	User.findById(hashtag.user, function(err, user) {
		user.hashtags.push(hashtag.id);
		user.save();
		res.send(hashtag);
	});
});

router.patch("/:id", function(req, res) {
	if (req.body.password) {
		bcrypt.hash(req.body.password, 10, function(err, hash) {
			req.body.password = hash;
			Hashtag.update({_id: req.params.id}, req.body, function(err, hashtag) {
				Hashtag.findById(req.params.id, function(err, hashtag) {
					res.json(hashtag);
				});
			});
		})
	} else {
		Hashtag.update({_id: req.params.id}, req.body, function(err, hashtag) {
			Hashtag.findById(req.params.id, function(err, hashtag) {
				res.json(hashtag);
			});
		});
	};
});

router.delete("/:id", function(req, res) {
	Hashtag.findByIdAndRemove(req.params.id, function(err, hashtag) {
		res.json("success");
	});
});

module.exports = router;