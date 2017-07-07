var mongoose = require("mongoose");

var HashtagSchema = new mongoose.Schema({
	name: String,
	user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
	saved: Boolean,
	timestamp: String,
	savedPosition: Number
});

var hashtagModel = mongoose.model("Hashtag", HashtagSchema);

module.exports = hashtagModel;