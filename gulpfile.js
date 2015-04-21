
var watchify = require('watchify');
var browserify = require('browserify');
var path = require('path');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');

var notify = require('gulp-notify');
var plumber = require('gulp-plumber');

var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');

var server = require('gulp-express');

// Javascript

var customOpts = {
  entries: ['./src/javascripts/main.js'],
  debug: true
};

var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

gulp.task('js', bundle);
b.on('update', bundle);
b.on('log', gutil.log);

function bundle() {
  return b.bundle()
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/javascripts'));
}


// Stylesheet

gulp.task('css', function () {
  return gulp.src('./src/stylesheets/**/*.less')
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('style.css'))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/stylesheets'));
});


// Server

gulp.task('server', function () {

    var options = process.env;
    options.NODE_ENV = process.env.NODE_ENV || 'development';

    server.run(['bin/www'], options);

    gulp.watch(['views/**/*.html'], [server.notify]);
    gulp.watch(['public/stylesheets/**/*.css'], [server.notify]);
    gulp.watch(['public/javascripts/**/*.js'], [server.notify]);
    gulp.watch(['public/images/**/*'], [server.notify]);
    gulp.watch(['app.js', 'bin/www', 'routes/**/*.js'], [server.run]);
});


// Task

gulp.task('default', ['js', 'css', 'server'], function() {
  gulp.watch('./src/stylesheets/**/*.less', ['css']);
});
