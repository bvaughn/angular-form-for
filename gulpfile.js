var gulp = require('gulp');
var es = require('event-stream');
var pipe = es.pipe.bind(es);
var concat = require('gulp-concat');

var CONFIG = {
  distDir: 'dist',
  sourceDir: 'source',
  stylesDir: 'styles',
  testDir: 'tests'
};

var jsSources = es.merge(
  gulp.src(CONFIG.sourceDir + '/**/module.js'), // Defines the formFor module; must be loaded first
  gulp.src([CONFIG.sourceDir + '/**/*.js', '!' + CONFIG.sourceDir + '/**/module.js']));

gulp.task('cacheTemplates', function () {
  var templateCache = require('gulp-angular-templatecache');

  return gulp.src('templates/**/*.html')
    .pipe(templateCache('templates.js', {
      module: 'formFor.templates',
      standalone: true
    }))
    .pipe(gulp.dest(CONFIG.distDir));
});

gulp.task('clean', function() {
  var rm = require('gulp-rimraf');

  pipe(
    gulp.src(['dist'], {read: false}),
    rm());
});

gulp.task('compileCss', function() {
  var stylus = require('gulp-stylus');
  var autoprefixer = require('autoprefixer-stylus');
  var nib = require('nib');

  return gulp.src(CONFIG.stylesDir + '/**/*.styl')
    .pipe(stylus({use: [nib(), autoprefixer()]}))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(CONFIG.distDir));
});

gulp.task('concatJs', function() {
  return jsSources
    .pipe(concat('form-for.js'))
    .pipe(gulp.dest(CONFIG.distDir));
});

gulp.task('lintJs', function() {
  var jshint = require('gulp-jshint');

  return jsSources
    .pipe(jshint());
});

gulp.task('test', function(done) {
  var karma = require('gulp-karma');

  return gulp.src('noop') // See http://stackoverflow.com/questions/22413767/angular-testing-with-karma-module-is-not-defined
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
});

gulp.task('build', ['clean', 'lintJs', 'test', 'concatJs', 'compileCss', 'cacheTemplates']);
