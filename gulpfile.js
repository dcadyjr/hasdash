var gulp = require("gulp");
var less = require("gulp-less");
var watch = require("gulp-watch");

gulp.task("watch", function() {
	gulp.watch(["./server/public/less/*.less"], ["compile-less"])
});

gulp.task("compile-less", function(){
	gulp.src("./server/public/less/*.less")
	.pipe(less())
	.pipe(gulp.dest("./server/public/css"));
});

gulp.task("default", ["compile-less","watch"]);