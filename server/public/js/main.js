console.log("connected")

// post to /users to make a new user
$("#sign-up").click(function() {
	var email = $("#email-field").val();
	var name = $("#name-field").val();
	var password = $("#password-field").val();
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