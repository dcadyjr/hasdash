var Twitter = require('twitter-node-client').Twitter;

var error = function (err, response, body) {
    	console.log('ERROR [%s]', err);
	};
	var success = function (data) {
    	console.log('Data [%s]', data);
	};

var config = {
	"consumerKey": "OaC9roLurAEaPYCeirXpyFRnc",
	"consumerSecret": "XL0n8y7dTjJJAlLfdjROBfKDumSr6ZHszQ5twzxG5noounP4VM",
	"accessToken": "4697806730-3hJcdhauFI3lv9ElAWCwrdAymMel2QDaxqes9P2",
	"accessTokenSecret": "Nv5bMizgiyNRrsnqL5SH4LJJGbr2JeN3DDSbMbELWX1te",
	"callBackUrl":
}

var twitter = new Twitter(config);

