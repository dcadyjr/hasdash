console.log("connected")

// toggle controls for the homepage (sign up / log in)
$("#login-toggle").click(function(){
	$("#signup-form").hide();
	$("#login-form").show();
	$(this).addClass("selected");
	$("#signup-toggle").removeClass("selected");
});
$("#signup-toggle").click(function(){
	$("#signup-form").show();
	$("#login-form").hide();
	$(this).addClass("selected");
	$("#login-toggle").removeClass("selected");
});



// initialize masonry

var $grid = $('.masonry-grid').masonry({
	itemSelector: '.grid-item',
	columnWidth: '.grid-sizer',
	percentPosition: true
});

// get tweets via ajax so the user doesn't go to a new address every time

var requestHashtag = function(hashtag) {
	var tag = hashtag
	var userId = $("body").attr("id");
	var data = {
		tag: tag,
		userId: userId
	};
	$.ajax({
		method: "POST",
		url: "http://localhost:3000/hashtags/search",
		data: data,
		success: function(response) {
			console.log(response);
			for (var i = 0; i < response.tweets.length; i++) {
				// append each new tweet in a masonry grid item div
				$('.masonry-grid').append("<div class='grid-item'>" + response.tweets[i] + "</div>");
			};
			// after widgets load, refresh masonry to reposition items
			twttr.ready(function(twttr) {
				twttr.events.bind('loaded', function (event) {
					$('.masonry-grid').masonry("destroy").masonry({
						itemSelector: '.grid-item',
						columnWidth: '.grid-sizer',
						percentPosition: true
					});
				});
			});
		}
	});
};

$('#hashtag-name').keypress(function (e) {
	if (e.which == 13) {
		var hashtag = $("#hashtag-name").val();
		requestHashtag(hashtag);
		return false;
	}
});

$("#get-tweets-button").click(function(){
	var hashtag = $("#hashtag-name").val();
	requestHashtag(hashtag);
});


// get tweets when you click on a hashtag in the sidebar
$(".taglist").click(function() {
	var hashtag = $(this).text();
	requestHashtag(hashtag);
	console.log(hashtag)
})



// post to /users to make a new user
$("#sign-up").click(function() {
	if ($("#signup-email-field").val() && $("#signup-name-field").val() && $("#signup-password-field").val()) {
		var email = $("#signup-email-field").val();
		var name = $("#signup-name-field").val();
		var password = $("#signup-password-field").val();
		var newUser = {
			email: email,
			name: name,
			password: password
		};
		$.ajax({
			method: "POST",
			url: "http://localhost:3000/users",
			data: newUser,
			success: function(response) {
				if (response.id) {
					window.location.href = "/users/" + response.id;
				} else {
					alert(response.error);
				};
			}
		});
	} else {
		alert("Please fill out all the fields :)")
	};
});

// post to /users/login to login
$("#login-button").click(function() {
	var email = $("#login-email-field").val();
	var password = $("#login-password-field").val();
	var user = {
		email: email,
		password: password
	};
	$.ajax({
		method: "POST",
		url: "http://localhost:3000/users/login",
		data: user,
		success: function(response) {
			if (response.id) {
				window.location.href = "/users/" + response.id;
			} else {
				alert(response.error);
			};
		}
	});
});

// patch to /users/:id to edit account info
$("#account-submit-button").click(function() {
	if ($("#account-password-field").val() !== "") {
		var myId = $("body").attr("id");
		var email = $("#account-email-field").val();
		var name = $("#account-name-field").val();
		var password = $("#account-password-field").val();
		var editedUser = {
			email: email,
			name: name,
			password: password
		};
		$.ajax({
			method: "PATCH",
			url: "http://localhost:3000/users/" + myId,
			data: editedUser,
			success: function(response) {
				window.location.href = "/users/account";
			}
		});
	} else {
		alert("password is required to change account info");
	};
});

//click function to initiate search from history
$(".taglist").click(function(){
		var 
	
	var embedHTML = [];

	twitter.getSearch({'q': "#" + $(this).text(),'count': 5}, function(){} , function(data){//this is the search to get tweet data.
			
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

 				var embedCode = JSON.parse(body);//this allows us to dig into the tweet imbed data
 					
 					embedHTML.push(embedCode.html);

 					if (embedHTML.length === 5){
 					var html = {tweets: embedHTML};
					res.render("dashboard", html);
				}
				
 				}
 			})
		}
			
	})
});












