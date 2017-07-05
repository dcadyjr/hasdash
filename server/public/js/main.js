console.log("connected")

// post to /users to make a new user
$("#sign-up").click(function() {
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
			window.location.href = "/users/" + response;
		}
	});
});

// post to /login to login
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
			window.location.href = "/users/" + response;
		}
	});
});