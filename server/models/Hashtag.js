var mongoose = require("mongoose");

var HashtagSchema = new mongoose.Schema({
	name: String,
	user: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
});

var hashtagModel = mongoose.model("Hashtag", HashtagSchema);

module.exports = hashtagModel;