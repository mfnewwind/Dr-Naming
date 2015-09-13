
var watchify = require('watchify');
var browserify = require('browserify');
var path = require('path');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash').assign;

var notify = require('gulp-notify');

var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');

var gls = require('gulp-live-server');

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
    .on('error', notify.onError('<%= error.message %>'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/javascripts'));
}

gulp.task('js-build', function () {

  var b = browserify(customOpts);

  return b.bundle()
    .on('error', notify.onError('<%= error.message %>'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
      .pipe(uglify())
      .on('error', gutil.log)
    .pipe(gulp.dest('./public/javascripts'));
});


// Stylesheet

gulp.task('css', function () {
  return gulp.src('./src/stylesheets/**/*.less')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(less())
    .on('error', notify.onError('<%= error.message %>'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('style.css'))
    .pipe(minifyCSS({ processImport: false }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/stylesheets'));
});


// Server

gulp.task('server', function () {

    var env = process.env;
    env.NODE_ENV = process.env.NODE_ENV || 'development';

    var server = gls('bin/www', env, false);
    server.start();

    gulp.watch(['app.js', 'bin/www', 'routes/**/*.js'], [server.start]);
});


// Task

gulp.task('default', ['js', 'css', 'server'], function() {
  gulp.watch('./src/stylesheets/**/*.less', ['css']);
});

gulp.task('build', ['js-build', 'css']);
