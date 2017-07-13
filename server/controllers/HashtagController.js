var express = require("express"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	Hashtag = require("../models/Hashtag"),
	User = require("../models/User"),
	session = require("express-session"),
	bcrypt = require("bcrypt"),
	twitter = require("../twitter_api.js"),
	request = require('request'),//for making request to twitter for the embed html
	tweetstorm = require("../helpers/tweetstorm.js");

router.use(bodyParser.urlencoded({extended: true}));

router.post("/search", function(req, res){
	
	Hashtag.find({name: req.body.tag, user: req.body.userId}, function(error, hashtags){//looks in the db to see if a hashtag already exists for that user.
																						// if there is it put it in an array called hashtags.
		if(hashtags.length === 0){//if the array is empty it creates a new tag in the db

			var tag = new Hashtag({ //creates a new hashtag in the db.
				name: req.body.tag,
				user: req.body.userId,
				timestamp: req.body.timestamp
			})

			tag.save();//saves the hashtag to the db.

		//saves hashtag to the user in d
		User.findById(req.body.userId, function(error, user){

			var tagId = tag.id;

				user.hashtags.push(tagId);
				user.save();//saves the hashtag to the user in the db
			})
		} else {
			// if hashtag already exists, update the timestamp so it shows in history
			for (var i = 0; i < hashtags.length; i++) {
				hashtags[i].timestamp = req.body.timestamp;
				hashtags[i].save();
			
			};
		};
	})

		tweetstorm(req.body.tag, function(data){

				var html = {
 						tweets: data,
 						session: req.session

 					};
 					
			res.send(html);

		});
	
})


// write new positions for saved tags to the database
router.patch("/update-order", function(req, res) {
	var ticker = 0;
	var loopArray = function() {
	    Hashtag.findById(req.body.hashtags[ticker].id, function(err, hashtag) {
			hashtag.savedPosition = req.body.hashtags[ticker].position;
			hashtag.save();
			console.log(hashtag);
			ticker++;
			if(ticker < req.body.hashtags.length) {
	            loopArray();   
	        } else {
	        	res.json("updated");
	        }
		});
    };
    loopArray();
});

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
		timestamp: req.body.timestamp
	});
	hashtag.save();
	User.findById(hashtag.user, function(err, user) {
		user.hashtags.push(hashtag.id);
		user.save();
		res.send(hashtag);
	});
});

router.patch("/:id", function(req, res) {
	Hashtag.update({_id: req.params.id}, req.body, function(err, hashtag) {
		Hashtag.findById(req.params.id, function(err, hashtag) {
			res.json(hashtag);
		});
	});
});

router.delete("/:id", function(req, res) {
	Hashtag.findByIdAndRemove(req.params.id, function(err, hashtag) {
		res.json("success");
	});
});













module.exports = router;