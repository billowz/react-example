var gulp = require('gulp');
var clean = require('gulp-clean');
var eslint = require('gulp-eslint');
var webpack = require('gulp-webpack');
var react = require('gulp-react');
var sourcemaps = require('gulp-sourcemaps');
var webpackConfig = require('./webpack.config.js');

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

gulp.task('clean-dist', function() {
    return gulp.src('./dist')
        .pipe(clean());
});

gulp.task('build-dist', ['clean-dist'], function() {
    return gulp
        .src('./')
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean-lib', function() {
    return gulp.src('./lib')
        .pipe(clean());
});

gulp.task('build-lib', ['clean-lib', 'eslint'], function() {
    return gulp.src(['src/**/*.jsx','src/**/*.js'])
        .pipe(react())
        .pipe(gulp.dest('lib'));
});
gulp.task('default', ['build-lib', 'build-dist']);
