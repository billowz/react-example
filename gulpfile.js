var gulp = require('gulp'),
    path = require('path'),
    fs = require('fs'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    eslint = require('gulp-eslint'),
    sourcemaps = require('gulp-sourcemaps'),
    react = require('gulp-react'),
    webpack = require('webpack'),
    gulpWebpack = require('gulp-webpack'),
    WebpackDevServer = require('webpack-dev-server');

gulp.task('build:material', function() {
    var cfg = require('./webpack/material-ui.config.js');
    fs.exists('./dist/' + cfg.output.filename, function(ret) {
        if (!ret) {
            gulp.src('./')
                .pipe(gulpWebpack(cfg))
                .pipe(gulp.dest('./dist'))
                .pipe(rename(cfg.output.filename.replace(/.js$/, '.min.js')))
                .pipe(uglify())
                .pipe(gulp.dest('./dist'));
        }
    });
});

gulp.task('eslint', function() {
    return gulp.src(['src/**/*.js', 'src/**/*.jsx'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('eslint:lib', function() {
    return gulp.src(['src/**/*.js', 'src/**/*.jsx', '!src/**/docs/*', '!src/**/test/*'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('eslint:docs', function() {
    return gulp.src(['src/**/docs/*.js', 'src/**/docs/*.jsx'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('clean:lib', function() {
    return gulp.src('./lib')
        .pipe(clean());
});

gulp.task('clean:docs', function() {
    return gulp.src('./docs')
        .pipe(clean());
});

gulp.task('clean:dist', function() {
    return gulp.src(['dist/**', '!dist/material-ui*'])
        .pipe(clean());
});

gulp.task('build:lib', ['eslint:lib', 'clean:lib'], function() {
    return gulp.src(['src/**/*.jsx', 'src/**/*.js', '!src/**/docs/*', '!src/**/test/*'])
        .pipe(react())
        .pipe(gulp.dest('lib'));
});

gulp.task('build:docs', ['eslint:docs', 'clean:docs'], function() {
    return gulp.src(['src/**/docs/*.js', 'src/**/docs/*.jsx'])
        .pipe(react())
        .pipe(gulp.dest('docs'));
});

gulp.task('build:dist', [], function() {
    var cfg = require('./webpack/config.js');
    return gulp.src('./')
        .pipe(gulpWebpack(cfg))
        .pipe(gulp.dest('./dist'))
        .pipe(rename(cfg.output.filename.replace(/.js$/, '.min.js')))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean', ['clean:dist', 'clean:lib', 'clean:docs']);

gulp.task('build', ['build:lib', 'build:dist', 'build:material']);

gulp.task('server', function() {
    var cfg = Object.create(require('./webpack/dev.config.js'));
    new WebpackDevServer(webpack(cfg), {
        contentBase: path.join('./'),
        publicPath: cfg.output.publicPath,
        hot: true
    }).listen(cfg.port, cfg.host, function(err) {
        if (err) throw new gutil.PluginError('webpack-dev-server', err);
    });
});

gulp.task('default', ['build']);
