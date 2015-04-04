var gulp = require('gulp');

var SOURCES = [
  'app/scripts/app.js', // Defines module
  'app/demos/**/*.js',
  'app/scripts/**/*.js'
];
var DESINATION_DIR = 'built';
var DESINATION_FILE = 'angular-form-for-docs';

gulp.task('build', function(callback) {
  var runSequence = require('run-sequence');
  runSequence(
    'clean',
    'compile',
    'map',
    callback);
});

gulp.task('clean', function() {
  var clean = require('gulp-clean');

  return gulp.src(DESINATION_DIR)
    .pipe(clean());
});

gulp.task('compile', function() {
  var ngAnnotate = require('gulp-ng-annotate');
  var concat = require('gulp-concat');

  return gulp
    .src(SOURCES)
    .pipe(ngAnnotate())
    .pipe(concat(DESINATION_FILE + '.js'))
    .pipe(gulp.dest(DESINATION_DIR));
});

gulp.task('map', function() {
  var shell = require('gulp-shell');

  return shell.task(
    'uglifyjs --compress --mangle --source-map ' + DESINATION_FILE + '.js.map --source-map-root . -o ' + DESINATION_FILE + '.min.js -- ' + DESINATION_FILE + '.js',
    {cwd: process.cwd() + '/' + DESINATION_DIR}
  )();
});

gulp.task('default', ['build']);
