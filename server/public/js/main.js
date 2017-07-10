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
	$(".grid-item").remove();
	var tag = hashtag
	var userId = $("body").attr("id");
	var timestamp = $.now();
	var data = {
		tag: tag,
		userId: userId,
		timestamp: timestamp
	};
	$.ajax({
		method: "POST",
		url: "./hashtags/search",
		data: data,
		success: function(response) {
			console.log(response);
			for (var i = 0; i < response.tweets.length; i++) {
				// append each new tweet in a masonry grid item div
				$('.masonry-grid').append("<div class='grid-item'>" + response.tweets[i] + "</div>");
			};
			// after widgets load, refresh masonry to reposition items
			twttr.events.bind('loaded', function (event) {
				console.log("ok");
				$('.masonry-grid').masonry("destroy").masonry({
					itemSelector: '.grid-item',
					columnWidth: '.grid-sizer',
					percentPosition: true
				});
			});
		}
	});
};

// search for hashtags if you press enter while in the input
$('#hashtag-name').keypress(function (e) {
	if (e.which == 13) {
		var hashtag = $("#hashtag-name").val();
		requestHashtag(hashtag);
		return false;
	}
});

// search for hashtags on button click
$("#get-tweets-button").click(function(){
	var hashtag = $("#hashtag-name").val();
	requestHashtag(hashtag);
});


// get tweets when you click on a hashtag in the sidebar
var getSidebarTweets = function() {
	$(".taglist a").not(".taglist span a").click(function(e) {
		e.preventDefault();
		$(".off-canvas").removeClass("vis"); // hide sidebar on mobile
		var hashtag = $(this).text();
		requestHashtag(hashtag);
		console.log(hashtag)
	})
};

getSidebarTweets();



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
			url: "./users",
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
		url: "./users/login",
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
			url: "./users/" + myId,
			data: editedUser,
			success: function(response) {
				window.location.href = "/users/account";
			}
		});
	} else {
		alert("password is required to change account info");
	};
});

// request to update order
var updateOrder = function() {
  	var hashtagsArray = [];
  	$("#sortable .taglist").each(function(i) {
  		var thisId = $(this).attr("id");
  		var thisPosition = i + 1;
  		hashtagsArray.push({id: thisId, position: thisPosition});
  	});
  	var data = {hashtags: hashtagsArray}
  	$.ajax({
		method: "PATCH",
		url: "./hashtags/update-order",
		data: data,
		success: function(response) {
			console.log(response);
		}
	});
}


// function to make history list drag sortable
$(function() {
    $("#sortable").sortable({
      revert: true,
      helper: 'clone',
      // when it updates send a request to update the hashtag order in the database
      update: function() {
      	updateOrder();
      }
    });
 
    $("ul, li").disableSelection();
  } );

// save and unsave hashtags
var saveHandlers = function() {
	$(".taglist .hover-option a").on("click", function(e) {
		e.preventDefault();
		var thisHashId = $(this).parent().parent().attr("id");
		if ($(this).text() === "save") {
			var data = {saved: true};
			// write to DOM if it's not there already
			if ($("#sortable #" + thisHashId).length === 0) {
				var thisName = $("#" + thisHashId + " a").not(".hover-option a").text();
				$("#sortable").append('<li class="taglist ui-state-default ui-sortable-handle" id="' + thisHashId + '"><a href="#">' + thisName + '</a> <span class="hover-option">(<a href="#">unsave</a>)</span></li>');
				// reattach click handlers so they cover the new DOM element
				saveHandlers();
				getSidebarTweets();				
			}
		} else {
			var data = {saved: false}
			// remove from DOM
			$("#sortable #" + thisHashId).remove();
		};
		$.ajax({
			method: "PATCH",
			url: "./hashtags/" + thisHashId,
			data: data,
			success: function(response) {
				console.log(response);
			}
		});
		updateOrder();
	})
};

saveHandlers();



// hide/display off-canvas hashstory on mobile
var offCanvasDiv = $(".off-canvas");
var canvasToggle = false
$("#off-canvas-toggle").click(function() {
	if (canvasToggle) {
		$(".off-canvas").removeClass("vis");
	} else {
		$(".off-canvas").addClass("vis");
	}
});

// from https://stackoverflow.com/questions/1403615/use-jquery-to-hide-a-div-when-the-user-clicks-outside-of-it
$("body").on("click", function(e) {
	if (!$("#off-canvas-toggle").is(e.target) && !offCanvasDiv.is(e.target) && offCanvasDiv.has(e.target).length === 0) {
		$(".off-canvas").removeClass("vis");
	};
});

