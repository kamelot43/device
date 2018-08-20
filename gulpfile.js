'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var imgmin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var del = require('del');
var run = require('run-sequence');
var browserSync = require('browser-sync');
var server = browserSync.create();

gulp.task('style', function () {
  return gulp
    .src('less/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'));
});

gulp.task('html', function () {
  return gulp
    .src('*.html')
    .pipe(gulp.dest('build'));
});

gulp.task('js', function () {
  return gulp
    .src('js/**/*.js')
    .pipe(gulp.dest('build/js/'))
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.basename +='.min';
    }))
    .pipe(gulp.dest('build/js'));
});

gulp.task('images', function () {
  return gulp
    .src('img/**/*.{png,jpg}')
    .pipe(imgmin([
      imgmin.optipng({optimizationLevel: 3}),
      imgmin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest('img'));
});

gulp.task('copy', function () {
  return gulp.src([
    '*.html',
    'fonts/**/*.{woff,woff2,ttf}',
    'img/**'
  ], {
    base: '.'
  })
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('serve', function () {
  server.init({
    server: 'build/'
  });

  gulp.watch('less/**/*.less', ['style']);
  gulp.watch('js/*.js', ['js']);
  gulp.watch('*.html', ['html']);

  gulp.watch('build/**/*').on('change', server.reload);
});

gulp.task('build', function (done) {
  run('clean', 'copy', 'style', 'js', done)
});
