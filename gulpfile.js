var gulp = require('gulp');

// Include Our Plugins
var argv        = require('yargs').argv,
    clean       = require('gulp-clean'),
    coffee      = require('gulp-coffee');
    compass     = require('gulp-compass'),
    concat      = require('gulp-concat'),
    header      = require('gulp-header'),
    gulpif      = require('gulp-if'),
    jshint      = require('gulp-jshint'),
    livereload  = require('gulp-livereload'),
    preprocess  = require('gulp-preprocess'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify');

// https://www.npmjs.com/package/gulp-file-include

var config = { env: 'dev' };

var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' */',
  ''].join('\n');

/**
 * Compass/SASS related tasks --------------------------------------------------
 */

// Clean existing .css files out of destination prior to copying new files.
gulp.task('clean-styles', function() {
  var taskExecutionLocation;

  if (argv.production !== true) taskExecutionLocation = './dev/css/**/*.css';
  else taskExecutionLocation = './dist/css/**/*';

  return gulp.src(taskExecutionLocation, {read: false})
      .pipe(clean());
});

// Master Compass task
gulp.task('compass', ['clean-styles'], function() {
   var taskDestination,
       outputStyle;

  if (argv.production === true) {
    taskDestination = './dist/css/';
    outputStyle     = 'compressed';
  }
  else {
    taskDestination = './dev/css/';
    outputStyle     = 'nested';
  }

  // gulp.src('./src/files/scss/**/*.scss')
  gulp.src('./src/files/scss/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: taskDestination,
      // sass: './src/files/scss',
      sass: 'src/files/scss',
      sourcemap: false,
      style: outputStyle
    }))
    .pipe(gulp.dest(taskDestination));
});

/**
 * Javascripts related tasks ---------------------------------------------------
 */

// Lint non vendor code prior to concatination with vendor files.
gulp.task('lint', function() {
  gulp.src('./src/files/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Clean existing .js files out of destination prior to copying new files.
gulp.task('clean-scripts', function() {
  var taskExecutionLocation;

  if (argv.production !== true) taskExecutionLocation = './dev/js/**/*.js';
  else taskExecutionLocation = './dist/js/**/*.js';

  return gulp.src(taskExecutionLocation, {read: false})
      .pipe(clean());
});

// Copy support scripts files to destination.
gulp.task('copy-scripts', function() {
  // HTML5 Shiv
  gulp.src([
    './vendor/bower/html5shiv.min/*.js'
  ])
  .pipe(rename('html5shiv.js'))
  .pipe(gulpif(argv.production !== true, gulp.dest('./dev/js/vendor/')))
  .pipe(gulpif(argv.production, gulp.dest('./dist/js/vendor/')));

  // Respond
  gulp.src([
    './vendor/bower/respond.min/*.js'
  ])
  .pipe(rename('respond.min.js'))
  .pipe(gulpif(argv.production !== true, gulp.dest('./dev/js/vendor/')))
  .pipe(gulpif(argv.production, gulp.dest('./dist/js/vendor/')));
});

// Master scripts task
gulp.task('scripts', ['clean-scripts', 'copy-scripts', 'coffee'], function() {
  // gulp.src([
  //   './src/files/js/FILENAME.js',
  //   ])
  //   .pipe(gulpif(argv.production !== true, gulp.dest('./dev/js/')))
  //   .pipe(gulpif(argv.production,
  //     uglify(),
  //     header(banner, {pkg:pkg}),
  //     rename({suffix: '.min'}),
  //     gulp.dest('./dist/js/')
  //   ));
});

/**
 * Coffeescript related tasks --------------------------------------------------
 */
 gulp.task('coffee', function() {
  //  gulp.src([
  //   //  './vendor/bower/jquery-1.11.2.min/index.js',
  //    './src/files/coffee/scripts.coffee',
  //  ])
  //  .pipe(gulpif(/[.]coffee$/, coffee({bare:true})))
  //  .pipe(concat('scripts.js'))
  //  .pipe(gulpif(argv.production !== true, gulp.dest('./dev/js/')))
  //  .pipe(gulpif(argv.production,
  //    uglify(),
  //    header(banner, {pkg:pkg}),
  //    rename('scripts.min.js'),
  //    gulp.dest('./dist/js/')
  //  ));
 });

/**
 * HTML related tasks ----------------------------------------------------------
 */

// Clean existing .html files out of destination prior to copying new files.
gulp.task('clean-html', function() {
  var taskExecutionLocation;

  if (argv.production !== true) taskExecutionLocation = './dev/*.html';
  else taskExecutionLocation = './dist/*.html';

  return gulp.src(taskExecutionLocation, {read: false})
      .pipe(clean());
});

// Preprocess HTML
gulp.task('html', ['clean-html'], function() {
  var taskDestination, myDebug;

  if (argv.production === true) {
    taskDestination = './dist/';
    config.env = 'prod';
    myDebug = false;
  }
  else {
    taskDestination = './dev/';
    myDebug = true;
  }

  gulp.src('./src/files/templates/*.html')
    .pipe(preprocess({context: {
      NODE_ENV: config.env,
      DEBUG: myDebug,
    }}))
    .pipe(gulp.dest(taskDestination));
});

/**
 * Assets tasks ----------------------------------------------------------------
 */

// Clean existing 'ui' folder contents.
gulp.task('clean-ui', function() {
  var taskExecutionLocation;

  if (argv.production !== true) taskExecutionLocation = './dev/ui';
  else taskExecutionLocation = './dist/ui';

  return gulp.src(taskExecutionLocation, {read: false})
      .pipe(clean());
});

// Copy 'ui' folder contents
gulp.task('copy-ui', ['clean-ui'], function() {
  gulp.src(['./src/files/ui/**/*'])
  .pipe(gulpif(argv.production !== true, gulp.dest('./dev/ui/')))
  .pipe(gulpif(argv.production, gulp.dest('./dist/ui/')));
});

// Clean existing 'images' folder contents.
gulp.task('clean-images', function() {
  var taskExecutionLocation;

  if (argv.production !== true) taskExecutionLocation = './dev/images';
  else taskExecutionLocation = './dist/images';

  return gulp.src(taskExecutionLocation, {read: false})
      .pipe(clean());
});

// Copy 'images' folder contents
gulp.task('copy-images', ['clean-images'], function() {
  gulp.src(['./src/files/images/*'])
  .pipe(gulpif(argv.production !== true, gulp.dest('./dev/images/')))
  .pipe(gulpif(argv.production, gulp.dest('./dist/images/')));
});

// Clean existing 'fonts' folder contents.
gulp.task('clean-fonts', function() {
  var taskExecutionLocation;

  if (argv.production !== true) taskExecutionLocation = './dev/fonts';
  else taskExecutionLocation = './dist/fonts';

  return gulp.src(taskExecutionLocation, {read: false})
      .pipe(clean());
});

// Copy font files to destination.
gulp.task('copy-fonts', ['clean-fonts'], function() {
  gulp.src([
    './src/files/fonts/*'
  ])
  .pipe(gulpif(argv.production !== true, gulp.dest('./dev/fonts/')))
  .pipe(gulpif(argv.production, gulp.dest('./dist/fonts/')));
});

/**
 * Watch tasks -----------------------------------------------------------------
 */
gulp.task('watch', function() {
  if (argv.listen === true) livereload.listen();
  gulp.watch('./src/files/js/*.js', ['lint','scripts']);
  gulp.watch('./src/files/coffee/scripts.coffee', ['coffee']);
  gulp.watch('./src/files/scss/**/*.scss', ['compass']);
  gulp.watch('./src/files/templates/*.html', ['html']);
  if (argv.listen === true)
    gulp.watch('./dev/**').on('change', livereload.changed);
});

/**
 * Default tasks ---------------------------------------------------------------
 */
gulp.task('default', ['lint', 'scripts', 'compass', 'html','copy-ui','copy-images','copy-fonts']);
