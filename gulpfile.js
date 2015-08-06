var fs = require('fs'),
  path = require('path'),
  express = require('express'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  rename = require('gulp-rename'),
  less = require('gulp-less'),
  minifycss = require('gulp-minify-css'),
  concat = require('gulp-concat'),
  clean = require('gulp-clean'),
  eslint = require('gulp-eslint'),
  babel = require('gulp-babel'),
  sourcemaps = require('gulp-sourcemaps'),
  webpack = require('webpack'),
  gulpWebpack = require('gulp-webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  moduleBuilder = require('./module-builder.js'),
  mkcfg = require('./make.webpack.js'),
  library = 'RUI',
  requireLibrary = 'react-ui',
  externalReact = [{
    path: 'react',
    root: 'React',
    lib: 'react'
  }, {
    path: 'react/addons',
    root: 'React',
    lib: 'react'
  }],
  externals = externalReact.concat([{
    path: 'react-router',
    root: 'ReactRouter',
    lib: 'react-router'
  }, {
    path: 'material-ui',
    root: 'MaterialUI',
    lib: 'material-ui'
  }, {
    path: 'react-bootstrap',
    root: 'ReactBootstrap',
    lib: 'react-bootstrap'
  }]),
  appCfg = {
    depDir: './dependency',
    distDir: './dist',
    styleDistDir: './dist/css',
    scriptDir: './src/script',
    libDir: './lib',
    lessDir: './src/less',
    lessThemeDir: './src/less/theme',
    docLibDir: './doc',
    compontentMain: 'index.js',
    docMain: 'doc.js',
    docSrcDir: 'doc',
    host: 'localhost',
    cssfilename: 'react-ui',
    port: 8089,
    material: {
      src: './node_modules/material-ui/lib',
      library: 'MaterialUI',
      require: 'material-ui',
      filename: 'material-ui.js',
      externals: externalReact
    },
    react: {
      src: './react-with-tap.js',
      library: 'React',
      require: 'react',
      filename: 'react-with-tap.js',
    },
    compontent: {
      src: './src/script/index.js',
      library: library,
      require: requireLibrary,
      filename: requireLibrary + '.js',
      externals: externals
    },
    doc: {
      src: './src/script/doc.js',
      library: library,
      require: requireLibrary,
      filename: requireLibrary + '.doc.js',
      externals: externals.concat({
        path: requireLibrary,
        root: library,
        lib: requireLibrary
      })
    }
  }

function _buildCompontent(dir, option, checFile) {
  var output = path.join(__dirname, dir, option.filename);
  if (!checFile && fs.existsSync(output)) {
    return;
  }
  var cfg = {
      entry: option.src,
      output: output,
      devtool: 'source-map',
      library: option.library,
      externals: option.externals || [],
      plugins: option.plugins || []
    },
    miniCfg = {
      entry: option.src,
      output: output.replace(/js$/, 'min.js'),
      library: option.library,
      externals: option.externals || [],
      plugins: (option.plugins || []).concat(new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }))
    }
  return gulp.src('./')
    .pipe(gulpWebpack(mkcfg(cfg)))
    .pipe(gulp.dest(dir))
    .pipe(gulpWebpack(mkcfg(miniCfg)))
    .pipe(gulp.dest(dir));
}

gulp.task('build:react', function() {
  return _buildCompontent(appCfg.depDir, appCfg.react);
});

gulp.task('build:material', function() {
  return _buildCompontent(appCfg.depDir, appCfg.material);
});

gulp.task('build:lib', ['build:module', 'eslint:src', 'clean:lib'], function() {
  return gulp.src([appCfg.scriptDir + '/**/*.jsx', appCfg.scriptDir + '/**/*.js', '!' + appCfg.scriptDir + '/' + appCfg.docMain, '!' + appCfg.scriptDir + '/**/' + appCfg.docSrcDir + '/*'])
    .pipe(babel())
    .pipe(gulp.dest(appCfg.libDir));
});

gulp.task('build:lib:doc', ['build:module:doc', 'eslint:doc', 'clean:doc'], function() {
  return gulp.src([appCfg.scriptDir + '/' + appCfg.docMain, appCfg.scriptDir + '/**/' + appCfg.docSrcDir + '/*.js', appCfg.scriptDir + '/**/' + appCfg.docSrcDir + '/*.jsx'])
    .pipe(babel())
    .pipe(gulp.dest(appCfg.docLibDir));
});

gulp.task('build:compontent', ['build:module'], function() {
  return _buildCompontent(appCfg.distDir, appCfg.compontent, true);
});

gulp.task('build:doc', ['build:module:doc'], function() {
  return _buildCompontent(appCfg.distDir, appCfg.doc, true);
});

gulp.task('build:dist', ['clean:dist'], function() {
  return gulp.start(['build:compontent', 'build:doc', 'build:styles']);
});


gulp.task('build', ['build:lib', 'build:lib:doc', 'build:dist', 'build:react', 'build:material']);


gulp.task('build:module', function() {
  return gulp.src(appCfg.scriptDir)
    .pipe(moduleBuilder.buildModule({
      excludes: [/^doc\.js$/, /\/doc\/.*$/, /_[^/]*\.jsx?$/],
      out: function(dir) {
        if (dir === path.join(__dirname, appCfg.scriptDir)) {
          return appCfg.compontentMain.replace(/\.js$/, '');
        }
        return dir.replace(/.*[\\/]/g, '');
      },
      tpl: fs.readFileSync('./tmpl/index.js').toString()
    }))
    .pipe(gulp.dest(appCfg.scriptDir));
});

gulp.task('build:module:doc', function() {
  return gulp.src(appCfg.scriptDir)
    .pipe(moduleBuilder.buildDoc({
      out: appCfg.docMain.replace(/\.js$/, ''),
      includes: [/\/doc$/],
      excludes: [/_[^/]*\.jsx?$/],
      tpl: fs.readFileSync('./tmpl/doc.js').toString()
    }))
    .pipe(gulp.dest(appCfg.scriptDir));
});


gulp.task('eslint', function() {
  return gulp.src([appCfg.scriptDir + '/**/*.js', appCfg.scriptDir + '/**/*.jsx'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('eslint:src', function() {
  return gulp.src([appCfg.scriptDir + '/**/*.js', appCfg.scriptDir + '/**/*.jsx', '!' + appCfg.scriptDir + '/**/' + appCfg.docSrcDir + '/*'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('eslint:doc', function() {
  return gulp.src([appCfg.scriptDir + '/**/' + appCfg.docSrcDir + '/*.js', appCfg.scriptDir + '/**/' + appCfg.docSrcDir + '/*.jsx'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('build:less', function() {
  return gulp.src([appCfg.lessDir + '/*.less', '!' + appCfg.lessDir + '/theme.less'])
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(concat(appCfg.cssfilename + '.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(appCfg.styleDistDir))
    .pipe(rename(appCfg.cssfilename + '.min.css'))
    .pipe(minifycss())
    .pipe(gulp.dest(appCfg.styleDistDir));
});

gulp.task('build:theme', function(c) {
  moduleBuilder.scanFiles(path.join(__dirname, appCfg.lessThemeDir), function() {
    return false
  }, function(filePath, isDir, c) {
    if (isDir) {
      var dirName = filePath.replace(/.*[\\/]/g, '');
      gulp.src([appCfg.lessThemeDir + '/' + dirName + '/*.less',
        appCfg.lessDir + '/theme.less'
      ])
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat(appCfg.cssfilename + '-' + dirName + '.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(appCfg.styleDistDir + '/theme'))
        .pipe(rename(appCfg.cssfilename + '-' + dirName + '.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(appCfg.styleDistDir + '/theme'))
        .on('end', c);
    } else {
      c();
    }
  }, c);
});
gulp.task('build:styles', ['build:less', 'build:theme']);

gulp.task('clean:lib', function() {
  return gulp.src(appCfg.libDir)
    .pipe(clean());
});

gulp.task('clean:doc', function() {
  return gulp.src(appCfg.docLibDir)
    .pipe(clean());
});

gulp.task('clean:dist', function() {
  return gulp.src([appCfg.distDir])
    .pipe(clean());
});

gulp.task('clean:dependency', function() {
  return gulp.src([appCfg.depDir])
    .pipe(clean());
});

gulp.task('clean', ['clean:dist', 'clean:lib', 'clean:doc', 'clean:dependency']);

gulp.task('server', ['build:styles', 'build:module', 'build:module:doc', 'build:react', 'build:material'], function() {
  var cfg = {
    entry: {},
    publicPath: '/assets/',
    output: path.join(__dirname, '[name]'),
    library: library,
    externals: appCfg.doc.externals,
    hot: true,
    devtool: 'source-map',
    plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NoErrorsPlugin()]
  };
  cfg.entry[appCfg.compontent.filename] = appCfg.compontent.src;
  cfg.entry[appCfg.doc.filename] = appCfg.doc.src;
  cfg.entry['server.js'] = ['webpack-dev-server/client?http://' + appCfg.host + ':' + appCfg.port, 'webpack/hot/only-dev-server'];

  var devServer = new WebpackDevServer(webpack(mkcfg(cfg)), {
    contentBase: path.join('./misc'),
    publicPath: cfg.publicPath,
    hot: true,
    noInfo: false,
    inline: true
  });
  devServer.use('/assets/', express['static'](path.resolve(process.cwd(), 'dist')));
  devServer.use('/dependency/', express['static'](path.resolve(process.cwd(), 'dependency')));
  devServer.use('/dependency/', express['static'](path.resolve(process.cwd(), 'node_modules')));
  devServer.use('/dependency/', express['static'](path.resolve(process.cwd(), 'bower_components')));
  devServer.listen(appCfg.port, appCfg.host, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log('Listening at port ' + appCfg.port);
    }
  });
  gulp.watch(['src/**/*.js', 'src/**/*.jsx', '!src/doc.js', '!src/**/doc/*'], function(event) {
    if (event.type === 'added' || event.type === 'deleted') {
      gulp.start('build:module');
    }
  });
  gulp.watch('tmpl/index.js', ['build:module']);
  gulp.watch('src/**/doc/*', function(event) {
    if (event.type === 'added' || event.type === 'deleted') {
      gulp.start('build:module:doc');
    }
  });
  gulp.watch('tmpl/doc.js', ['build:module:doc']);
  gulp.watch([appCfg.lessDir + '/*.less', '!' + appCfg.lessDir + '/theme.less'], ['build:less']);
  gulp.watch([appCfg.lessThemeDir + '/*.less', appCfg.lessDir + '/theme.less'], ['build:theme']);
});

gulp.task('default', ['build']);
