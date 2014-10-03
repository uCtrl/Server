var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	mocha = require('gulp-mocha'),
	nodemon = require('gulp-nodemon'),
	seed = require(__dirname + '/seed/seed.js');

gulp.task('jshint', function() {
    gulp.src(['app/**/*.js'])
        .pipe(jshint('./.jshintrc'))
        .pipe(jshint.reporter());
});

gulp.task('test', function() {
	process.env.NODE_ENV = 'test';
    gulp.src('test/**/*.js')
        .pipe(mocha({
			reporter: 'spec'
		}));
});

gulp.task('seed', function() {
	seed();
});

gulp.task('default', function () {
 	nodemon({ script: 'server.js' });
});