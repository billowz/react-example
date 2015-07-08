var gulp = require('gulp');
uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    eslint = require('gulp-eslint'),
    webpack = require('gulp-webpack'),
    react = require('gulp-react'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('eslint', function() {
    return gulp.src(['src/**'])
        // eslint() attaches the lint output to the eslint property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failOnError last.
        .pipe(eslint.failOnError());
});

gulp.task('clean:lib', function() {
    return gulp.src('./lib')
        .pipe(clean());
});

gulp.task('build:lib', ['eslint', 'clean:lib'], function() {
    return gulp.src(['src/**/*.jsx', 'src/**/*.js'])
        .pipe(react())
        .pipe(gulp.dest('lib'));
});

gulp.task('clean:dist', function() {
    return gulp.src('./dist')
        .pipe(clean());
});

gulp.task('build:dist', ['clean:dist', 'build:lib'], function() {
    return gulp
        .src('./')
        .pipe(webpack(require('./webpack/config.js')))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build:material', function() {
    var cfg = require('./webpack/material-ui.config.js');
    return gulp.src('./')
        .pipe(webpack(cfg))
        .pipe(gulp.dest('./dist'))
        .pipe(rename(cfg.libraryName + '.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean', ['clean:dist', 'clean:lib']);
gulp.task('default', ['build:material','build:dist']);
