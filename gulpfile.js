var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    fs = require('fs'),
    express = require('express'),
    clean = require('gulp-clean'),
    eslint = require('gulp-eslint'),
    babel = require('gulp-babel'),
    webpack = require('webpack'),
    gulpWebpack = require('gulp-webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    moduleBuilder = require('./module-builder.js'),
    mkcfg = require('./make.webpack.js');

var materialExternals = [{
    path: 'react',
    root: 'React',
    lib: 'react'
}, {
    path: 'react/addons',
    root: 'React',
    lib: 'react'
}];
var libExternals = [{
    path: 'react',
    root: 'React',
    lib: 'react'
}, {
    path: 'react/addons',
    root: 'React',
    lib: 'react'
}, {
    path:'react-router',
    root:'ReactRouter',
    lib:'react-router'
}, {
    path: 'material-ui',
    root: 'MaterialUI',
    lib: 'material-ui'
}, {
    path: 'react-bootstrap',
    root: 'ReactBootstrap',
    lib: 'react-bootstrap'
}];
var docExternals = libExternals.concat({
    path: 'react-ui',
    root: 'RUI',
    lib: 'react-ui'
});
gulp.task('build:material', function() {
    if (!fs.existsSync('./dependency/material-ui.js')) {
        var src = './node_modules/material-ui/lib',
            library = 'MaterialUI',
            output = path.join(__dirname, 'dependency/material-ui.js'),
            cfg = mkcfg({
                entry: src,
                output: output,
                library: library,
                externals: materialExternals
            }),
            miniCfg = mkcfg({
                entry: src,
                output: output.replace(/js$/, 'min.js'),
                library: library,
                externals: materialExternals,
                plugins: [new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    }
                })]
            });
        return gulp.src('./')
            .pipe(gulpWebpack(cfg))
            .pipe(gulp.dest('./dependency'))
            .pipe(gulpWebpack(miniCfg))
            .pipe(gulp.dest('./dependency'));
    }
});

gulp.task('build:react', function() {
    if (!fs.existsSync('./dependency/react-with-tap.js')) {
        var src = './react-with-tap.js',
            library = 'React',
            output = path.join(__dirname, 'dependency/react-with-tap.js'),
            cfg = mkcfg({
                entry: src,
                output: output,
                library: library
            }),
            miniCfg = mkcfg({
                entry: src,
                output: output.replace(/js$/, 'min.js'),
                library: library,
                plugins: [new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    }
                })]
            });
        return gulp.src('./')
            .pipe(gulpWebpack(cfg))
            .pipe(gulp.dest('./dependency'))
            .pipe(gulpWebpack(miniCfg))
            .pipe(gulp.dest('./dependency'));
    }
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

gulp.task('eslint:doc', function() {
    return gulp.src(['src/**/doc/*.js', 'src/**/doc/*.jsx'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('clean:lib', function() {
    return gulp.src('./lib')
        .pipe(clean());
});

gulp.task('clean:doc', function() {
    return gulp.src('./doc')
        .pipe(clean());
});

gulp.task('clean:dist', function() {
    return gulp.src(['./dist'])
        .pipe(clean());
});

gulp.task('clean:dependency', function() {
    return gulp.src(['./dependency'])
        .pipe(clean());
});

gulp.task('clean', ['clean:dist', 'clean:lib', 'clean:doc', 'clean:dependency']);

gulp.task('build:module', function() {
    return gulp.src('./src')
        .pipe(moduleBuilder.buildModule({
            excludes: [/^doc\.js$/, /\/doc\/.*$/],
            out: function(dir) {
                if (dir === path.join(__dirname, 'src')) {
                    return 'index';
                }
                return dir.replace(/.*[\\/]/g, '');
            },
            tpl: fs.readFileSync('./tmpl/index.js').toString()
        }))
        .pipe(gulp.dest('src'));
});

gulp.task('build:docmodule', function() {
    return gulp.src('./src')
        .pipe(moduleBuilder.buildDoc({
            out: 'doc',
            includes: [/\/doc\/[^/]*$/],
            tpl: fs.readFileSync('./tmpl/doc.js').toString()
        }))
        .pipe(gulp.dest('src'));
});
gulp.task('build:lib', ['eslint:lib', 'build:module'], function() {
    return gulp.src(['src/**/*.jsx', 'src/**/*.js', '!src/doc.js', '!src/**/doc/*', '!src/**/test/*'])
        .pipe(babel())
        .pipe(gulp.dest('lib'));
});

gulp.task('build:doc', ['eslint:doc', 'build:docmodule'], function() {
    return gulp.src(['src/doc.js', 'src/**/doc/*.js', 'src/**/doc/*.jsx'])
        .pipe(babel())
        .pipe(gulp.dest('doc'));
});

gulp.task('build:dist', [], function() {
    var src = './src/index.js',
        library = 'RUI',
        output = path.join(__dirname, 'dist/react-ui.js'),
        cfg = mkcfg({
            entry: src,
            output: output,
            library: library,
            externals: libExternals
        }),
        miniCfg = mkcfg({
            entry: src,
            output: output.replace(/js$/, 'min.js'),
            library: library,
            externals: libExternals,
            plugins: [new webpack.optimize.UglifyJsPlugin()]
        });
    return gulp.src('./')
        .pipe(gulpWebpack(cfg))
        .pipe(gulp.dest('./dist'))
        .pipe(gulpWebpack(miniCfg))
        .pipe(gulp.dest('./dist'));
});


gulp.task('build', ['build:lib', 'build:doc', 'build:dist', 'build:react', 'build:material']);

gulp.task('server', ['build:module', 'build:docmodule', 'build:react', 'build:material'], function() {
    var host = 'localhost',
        port = 8089,
        library = 'RUI',
        cfg = mkcfg({
            entry: {
                'react-ui': ['./src/index.js'],
                'doc': ['./src/doc.js', 'webpack-dev-server/client?http://' + host + ':' + port, 'webpack/hot/only-dev-server']
            },
            publicPath: '/assets/',
            output: path.join(__dirname, 'dist/[name].js'),
            library: library,
            externals: docExternals,
            hot: true,
            devtool: 'source-map',
            plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NoErrorsPlugin()]
        });

    var devServer = new WebpackDevServer(webpack(cfg), {
        contentBase: path.join('./misc'),
        publicPath: '/assets/',
        hot: true,
        noInfo: true,
        inline: true
    });
    devServer.use('/dependency/', express['static'](path.resolve(process.cwd(), 'dependency')));
    devServer.use('/dependency/', express['static'](path.resolve(process.cwd(), 'node_modules')));
    var listeningApp = devServer.listen(port, host, function(err, result) {
        if (err) {
            console.log(err);
        }
        console.log('Listening at port ' + port);
    });
    gulp.watch(['src/**/*.js', 'src/**/*.jsx', '!src/doc.js', '!src/**/doc/*'], function(event) {
        if (event.type === 'added' || event.type === 'deleted') {
            gulp.start('build:module');
        }
    });
    gulp.watch('tmpl/index.js', ['build:module']);
    gulp.watch('src/**/doc/*', function(event) {
        if (event.type === 'added' || event.type === 'deleted') {
            gulp.start('build:docmodule');
        }
    });
    gulp.watch('tmpl/doc.js', ['build:docmodule']);
});

gulp.task('default', ['build']);
