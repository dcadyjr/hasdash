require('dotenv').config();
var Twitter = require('twitter-node-client').Twitter;

var error = function (err, response, body) {
    	console.log('ERROR [%s]', err);
	};
	var success = function (data) {
    	console.log('Data [%s]', data);
	};

var config = {
	"consumerKey": process.env.KEY,
	"consumerSecret": process.env.SECRET,
	"accessToken": process.env.TOKEN,
	"accessTokenSecret": process.env.TOKENSECRET
	// "callBackUrl"
}

var twitter = new Twitter(config);

//
	// Get 10 tweets containing the hashtag haiku
	//

	twitter.getSearch({'q':'#haiku','count': 10}, error, success);
	console.log(success);