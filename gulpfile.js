
/*!
 * $ npm install
 * $ gulp
 * $ gulp watch
 */

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    del = require('del');

// Styles
gulp.task('styles', function() {
  return sass('examples/assets/scss/stylesheet.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('examples/dist/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest('examples/dist/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('adjust_long', function() {
  return gulp.src([
      'src/adjust.js'
    ])
    .pipe(concat('adjust.js'))
    .pipe(gulp.dest('build'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('build'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src([
      'examples/assets/js/main_script.js'
    ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('examples/dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('examples/dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

//Example Add Active
gulp.task('example_add_active', function() {
  return gulp.src([
      'examples/assets/js/add_active.js'
    ])
    .pipe(concat('add_active.js'))
    .pipe(gulp.dest('examples/dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

//Example Add Active Draggable
gulp.task('example_add_active_draggable', function() {
  return gulp.src([
      'examples/assets/js/add_active_draggable.js'
    ])
    .pipe(concat('add_active_draggable.js'))
    .pipe(gulp.dest('examples/dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});


//Example Label
gulp.task('example_add_label', function() {
  return gulp.src([
      'examples/assets/js/add_label.js'
    ])
    .pipe(concat('add_label.js'))
    .pipe(gulp.dest('examples/dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});


//Example Track Points
gulp.task('example_add_points', function() {
  return gulp.src([
      'examples/assets/js/add_points.js'
    ])
    .pipe(concat('add_points.js'))
    .pipe(gulp.dest('examples/dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});




gulp.task('external_scripts', function() {
  return gulp.src([
      'examples/assets/external_js/three.min.js',
      'examples/assets/external_js/orbit_controls.js',
      'examples/assets/external_js/tween.js',
    ])
    .pipe(concat('three_and_controls.min.js'))
    .pipe(gulp.dest('examples/dist/ext_js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('examples/dist/ext_js'))
    .pipe(notify({ message: 'External Scripts task complete' }));
});


// Clean
gulp.task('clean', function() {
  return del(['examples/dist/css', 'examples/dist/ext_js', 'build', 'examples/dist/js']);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('styles','adjust_long', 'external_scripts', 'scripts','example_add_active','example_add_active_draggable','example_add_label');
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('examples/assets/scss/**/*.scss', ['styles']);

  // Watch example files
  gulp.watch('examples/assets/js/**/*.js', [
    'scripts',
    'example_add_active',
    'example_add_active_draggable',
    'example_add_label',
    'example_add_points',
    ]);

  gulp.watch('examples/assets/external_js/**/*.js', ['external_scripts']);

  gulp.watch('src/*.js', ['adjust_long']);



});