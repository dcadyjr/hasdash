var express = require("express"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	Hashtag = require("../models/Hashtag"),
	User = require("../models/User"),
	session = require("express-session"),
	bcrypt = require("bcrypt"),
	twitter = require("../twitter_api.js"),
	// tweetToHTML = require('tweet-to-html'),//converts twitter's API tweet objects text property to HTML
	request = require('request');//for making request to twitter for the embed html


router.use(bodyParser.urlencoded({extended: true}));

router.post("/search", function(req, res){
	
Hashtag.find({name: req.body.tag, user: req.body.userId}, function(error, hashtags){

	if(hashtags.length === 0){

		var tag = new Hashtag({ 
		name: req.body.tag,
		user: req.body.userId
		})

		tag.save();

		//saves hashtag to the user in d
		User.findById(req.body.userId, function(error, user){

			var tagId = tag.id;

			user.hashtags.push(tagId);

			user.save();
		})
	}
} )
	
// saves the hashtag to the db with the userId

	var embedHTML = [];

	twitter.getSearch({'q': "#" + req.body.tag,'count': 5}, function(){} , function(data){//this is the search to get tweet data.
			
		tweets = JSON.parse(data);//this allows us to dig into the tweet data

		for (var i = 0; i < tweets.statuses.length; i++){//this loops through each tweet and grabs the userScreenName and tweetId

			var userScreenName = tweets.statuses[i].user.screen_name;//variable to hold the UserScreenName
			var tweetId = tweets.statuses[i].id_str;//variable to hold the tweet Id
		
			//this url sends us code to embed the tweet on our page
			var url = 'https://publish.twitter.com/oembed?url=https%3A%2F%2Ftwitter.com%2F' + userScreenName + '%2Fstatus%2F' + tweetId;

 			request(url, function(err, resp, body){//request embed tweet info from twitter
 				if(err){
 					// console.log(err);
 				}else {

 				var embedCode = JSON.parse(body);//this allows us to dig into the tweet embed data
 					
 					embedHTML.push(embedCode.html);

 					if (embedHTML.length === 5){
 					var html = {
 						tweets: embedHTML,
 						session: req.session
 					};
					res.json(html);
				}
				
 				}
 			})
		}
			
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