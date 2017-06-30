var express = require("express"),
	app = express(),
	server = require("http").createServer(app),
	session = require("express-session"),
	path = require("path");

require("./db/db");

app.use(session({
	secret: "hashdashhh",
	resave: false,
	saveUninitialized: true,
	cookie: {secure: false}
}));

var UserController = require("./controllers/UserController");
app.use("/users", UserController);

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

server.listen(3000, function(){
	console.log("Listening on 3000!!")
});