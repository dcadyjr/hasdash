var express = require("express"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	Hashtag = require("../models/Hashtag"),
	User = require("../models/User"),
	session = require("express-session"),
	bcrypt = require("bcrypt");

router.use(bodyParser.urlencoded({extended: true}));

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