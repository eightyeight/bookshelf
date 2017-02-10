var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minify_css = require('gulp-minify-css'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  browserify = require('gulp-browserify'),
  uglify = require('gulp-uglify'),
  path = require('path');

gulp.task('scss', function () {
  gulp.src("scss/app.scss")
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        includePaths: [],
      })
      .on('error', sass.logError))
    .pipe(autoprefixer("last 2 version", "> 1%", "Explorer >= 8", {
      cascade: true
    }))
    .pipe(minify_css({compatibility: 'ie8'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/css/'));
});

gulp.task('js', function() {
   gulp.src('js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(browserify())
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/js/'))
});


gulp.task('live', function () {
  gulp.watch('scss/**/*.scss', ['scss']);
  gulp.watch('js/**/*.js', ['js']);
});

gulp.task('default', ['live']);