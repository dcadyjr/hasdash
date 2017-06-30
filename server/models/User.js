var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
	email: String,
	name: String,
	password: String,
	hashtags: [{type: mongoose.Schema.Types.ObjectId, ref: "Hashtag"}]
});

var userModel = mongoose.model("User", UserSchema);

module.exports = userModel;