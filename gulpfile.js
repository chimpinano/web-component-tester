var concat     = require('gulp-concat');
var gulp       = require('gulp');
var gulpIf     = require('gulp-if');
var lazypipe   = require('lazypipe');
var sourcemaps = require('gulp-sourcemaps');
var watch      = require('gulp-watch')
var wrap       = require('gulp-wrap');

var CSS_TO_JS =
    "(function() {\n" +
    "var style = document.createElement('style');\n" +
    "style.textContent = '<%= contents.replace(/'/g, \"\\\\'\").replace(/\\n/g, '\\\\n') %>';\n" +
    "document.head.appendChild(style);\n" +
    "})();";

gulp.task('build:browser', function() {
  return gulp.src([
      'vendor/mocha/mocha.js',
      'vendor/mocha/mocha.css',
      'vendor/chai/chai.js',
      'vendor/async/lib/async.js',
      'vendor/WebConsole-reporter/WebConsole.js',
      // Poor-man's dependency management, for now.
      'browser/index.js',
      'browser/util.js',
      'browser/**/*.{js,css}',
    ])
    .pipe(sourcemaps.init())
    .pipe(gulpIf(/\.css$/, wrap(CSS_TO_JS)))
    .pipe(concat('browser.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
  watch('browser/**/*', function() {
    gulp.start('build:browser');
  });
});
