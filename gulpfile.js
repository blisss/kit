var gulp = require("gulp");
var run = require("run-sequence");
var chalk = require("chalk");
var $ = require("gulp-load-plugins")({
    rename: {
				'gulp-ruby-sass': "sass",
				'gulp-minify-css': "mincss",
				'gulp-html-extend': "layout"
    }
});

var app_dir = "app/";
var temp_dir = "tmp/";
var build_dir = "dist/";

gulp.task("run:clean", function() {

    console.log("\n", chalk.yellow("清理文件夹"), "\n");
    
    return gulp.src(temp_dir)
				.pipe($.clean());
});

gulp.task("run:connect", function() {
    $.connect.server({
				root: temp_dir,
				livereload: true,
				port: 3000
    });
});

gulp.task("run:html", function () {

    console.log("\n", chalk.yellow("复制HTML"), "\n");
    
    return gulp.src(app_dir + 'views/**/*.html')
        .pipe($.layout({
						annotations: false,
						verbose: true,
						root: app_dir
				}))
        .pipe(gulp.dest(temp_dir))
				.pipe($.connect.reload());
});

gulp.task("run:style", function() {
    
    console.log("\n", chalk.yellow("复制CSS"), "\n");
    
    return $.sass(app_dir + 'styles/**/*.scss', {
				sourcemap: false,
				noCache: true,
				verbose: true,
				//require: "sass-globbing",
				style: "compact" // expanded
    })
				.pipe(gulp.dest(temp_dir + 'styles'))
				.pipe($.connect.reload());
});

gulp.task("run:css", function() {
    
    console.log("\n", chalk.yellow("复制CSS"), "\n");
    
    return gulp.src(app_dir + 'styles/**/*.css')
				.pipe(gulp.dest(temp_dir + 'styles'))
				.pipe($.connect.reload());
});

gulp.task("run:fonts", function() {

    console.log("\n", chalk.yellow("复制Fonts"), "\n");

    return gulp.src(app_dir + "fonts/**/*.*")
				.pipe(gulp.dest(temp_dir + "fonts"))
				.pipe($.connect.reload());
});

gulp.task("run:images", function() {

    console.log("\n", chalk.yellow("复制Images"), "\n");

    return gulp.src(app_dir + "images/**/*.*")
				.pipe(gulp.dest(temp_dir + "images"))
				.pipe($.connect.reload());
});

gulp.task("run:containers", function() {

    console.log("\n", chalk.yellow("复制Containers"), "\n");

    return gulp.src(app_dir + "containers/**/*.*")
				.pipe($.babel({
						modules: "umdStrict" //"ignore"
				}))
				.pipe(gulp.dest(temp_dir + "containers"))
				.pipe($.connect.reload());
});

gulp.task("run:components", function() {

    console.log("\n", chalk.yellow("复制Components"), "\n");

    return gulp.src(app_dir + "components/**/*.*")
				.pipe($.babel({
						modules: "umdStrict" //"ignore"
				}))
				.pipe(gulp.dest(temp_dir + "components"))
				.pipe($.connect.reload());
});

gulp.task("run:javascripts", function() {

    console.log("\n", chalk.yellow("复制Javascripts"), "\n");

    return gulp.src(app_dir + "javascripts/*.js")
				.pipe($.babel({
						modules: "umdStrict" //"ignore" //"umdStrict"
				}))
				.pipe(gulp.dest(temp_dir + "javascripts"))
				.pipe($.connect.reload());
});

gulp.task("run:vendor", function() {

    console.log("\n", chalk.yellow("复制vendor"), "\n");

    return gulp.src(app_dir + "libs/**/*.js")
		//.pipe($.concat('vendor.js'))
				.pipe(gulp.dest(temp_dir + "javascripts/libs"))
				.pipe($.connect.reload());
});



gulp.task("run", function() {
    return run("run:clean", [
				"run:html",
				"run:style",
				"run:fonts",
				"run:images",
				"run:css",
				//"run:containers",
				//"run:components",
				"run:javascripts",
				"run:vendor"
    ]);
});

gulp.task("server", ["run", "run:connect"], function() {
    gulp.watch(app_dir + "views/**/*.html", ["run:html"]);
    gulp.watch(app_dir + "layouts/**/*.html", ["run:html"]);
    gulp.watch(app_dir + "styles/**/*.scss", ["run:style"]);
		gulp.watch(app_dir + "styles/**/*.css", ["run:css"]);
    gulp.watch(app_dir + "fonts/**/*.*", ["run:fonts"]);
    gulp.watch(app_dir + "images/**/*.*", ["run:images"]);
    //gulp.watch(app_dir + "containers/**/*.*", ["run:containers"]);
    //gulp.watch(app_dir + "components/**/*.*", ["run:components"]);
    gulp.watch(app_dir + "javascripts/*.*", ["run:javascripts"]);
    gulp.watch(app_dir + "javascripts/libs/**/*.*", ["run:vendor"]);
});

gulp.task('default', ['server']);

gulp.task('build', []);
