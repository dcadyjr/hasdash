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



// get tweets via ajax so the user doesn't go to a new address every time
$("#get-tweets-button").click(function() {
	var tag = $("#hashtag-name").val();
	var data = {tag: tag};
	$.ajax({
		method: "POST",
		url: "http://localhost:3000/hashtags/search",
		data: data,
		success: function(response) {
			console.log(response);
			for (var i = 0; i < response.tweets.length; i++) {
				$('.masonry-grid').append(response.tweets[i]);
			};
			$('.masonry-grid blockquote').masonry();
		}
	});
});



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