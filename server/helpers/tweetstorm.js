var twitter = require("../twitter_api.js"),
request = require('request');

var tweetstorm = function(hash, callback){

	var embedHTML = [];//array to hold the blockguote code from twitter to display embedded tweets

	twitter.getSearch({'q': "#" + hash + "&-filter:nativeretweets",'count': 20}, function(){} , function(data){//this is the search to get tweet data.
			
		tweets = JSON.parse(data);//this allows us to dig into the tweet data

		for (var i = 0; i < tweets.statuses.length; i++){//this loops through each tweet and grabs the userScreenName and tweetId

			var userScreenName = tweets.statuses[i].user.screen_name;//variable to hold the UserScreenName
			var tweetId = tweets.statuses[i].id_str;//variable to hold the tweet Id
		
			//this url sends us code to embed the tweet on our page
			var url = 'https://publish.twitter.com/oembed?url=https%3A%2F%2Ftwitter.com%2F' + userScreenName + '%2Fstatus%2F' + tweetId;

 			request(url, function(err, resp, body){//request embed tweet info from twitter
 				if(err){
 					console.log(err);
 				}else {

 				var embedCode = JSON.parse(body);//this allows us to dig into the tweet embed data
 					
 					embedHTML.push(embedCode.html);

 					if (embedHTML.length === 10){//this waits for the embed array to be full before showing on the page.
 					
 					 callback(embedHTML);
					
				 }
				
 				}
 			})
		}
			
	})
}

module.exports = tweetstorm;