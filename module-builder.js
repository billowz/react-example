var path = require('path'),
    gutil = require('gulp-util'),
    through = require('through2'),
    fs = require('fs'),
    ejs = require('ejs'),
    rimraf = require('rimraf');
var builder = {
    parseModuleName: function(name) {
        name = name.replace(/[^a-zA-Z0-9][a-z]?/g, function(w) {
            if (w.length === 1) {
                return '';
            }
            return w[1].toUpperCase();
        });
        return name.substr(0, 1).toUpperCase() + name.substr(1);
    },
    scanFiles: function(dir, dirFilter, callback, end) {
        fs.readdir(dir, function(err, files) {
            if (files.length === 0) {
                end();
            }
            var _executed = 0;
            var _end = function() {
                _executed++;
                if (files.length === _executed) {
                    end();
                }
            }
            files.forEach(function(f) {
                var fpath = path.join(dir, f);
                fs.stat(fpath, function(err, stats) {
                    if (err) {
                        console.log('scan dir with error.');
                    } else {
                        if (stats.isDirectory()) {
                            if (!dirFilter || dirFilter(fpath) !== false) {
                                builder.scanFiles(fpath, dirFilter, callback, function() {
                                    callback(fpath, true, _end);
                                });
                            } else {
                                callback(fpath, true, _end);
                            }
                        } else {
                            callback(fpath, false, _end);
                        }
                    }
                })
            });
        });
    },
    _MODULE_GENERATOR: '/*@MODULE_GENERATOR@*/',
    clean: function() {
        return through.obj(function(dir, e, c) {
            builder.scanFiles(dir.path, null, function(f, isDir, _c) {
                if (!isDir) {
                    var dat = fs.readFileSync(f, 'utf-8');
                    if (dat.indexOf(builder._MODULE_GENERATOR) === 0) {
                        rimraf(f);
                        this.push(f);
                    }
                }
                _c();
            }.bind(this), c);
        });
    },
    _buildModuleIndex: function(baseDir, dir, output, filter, callback, tpl) {
        output = output || 'index';
        var filePath = path.join(dir, output + '.jsx'),
            file, hasFile;
        if (!fs.existsSync(filePath)) {
            filePath = path.join(dir, output + '.js');
            hasFile = fs.existsSync(filePath);
        } else {
            hasFile = true;
        }
        if (hasFile) {
            if (fs.readFileSync(filePath, 'utf-8').indexOf(builder._MODULE_GENERATOR) !== 0) {
                callback();
                return;
            }
        }
        var modules = [];
        builder.scanFiles(dir, function() {
            return false
        }, function(_f, _isdir, _c) {
            var fileName, modulePath, moduleName;
            _f = _f.replace(/.*[\\/]/g, '');
            if (!filter(_f, _isdir)) {
                _c();
                return;
            }
            if (_isdir) {
                fileName = _f;
                modulePath = './' + _f + '/' + _f;
                moduleName = builder.parseModuleName(fileName);
            } else {
                fileName = _f.replace(/\.[^\.]*$/, '');
                if (fileName === output) {
                    _c();
                    return;
                }
                modulePath = './' + fileName;
                moduleName = builder.parseModuleName(fileName);
            }
            modules.push({
                name: moduleName,
                path: modulePath
            });
            _c();
        }, function() {
            if (modules.length > 0) {
                var _contents = builder._MODULE_GENERATOR + '\n' + ejs.render(tpl, {
                    modules: modules
                });
                var _file = new gutil.File({
                    base: baseDir,
                    path: filePath,
                    contents: new Buffer(_contents),
                });
                callback(_file);
                gutil.log('build module: ' + _file.path + '\n' + _contents);
            } else {
                callback();
            }
        });
    },
    build: function(opt) {
        opt = opt || {};
        var output = opt.out || 'index',
            reg = opt.reg || /(\\.js)x?$/,
            dirReg = opt.dirReg || /^doc$/,
            buildSubModule = opt.buildSubModule || false,
            build = function(baseDir, dir, output, c) {
                builder._buildModuleIndex(baseDir, dir, output, function(f, isdir) {
                    if (isdir) return dirReg.test(f);
                    return reg.test(f);
                }, function(f) {
                    if (f) {
                        this.push(f);
                    }
                    c();
                }.bind(this), tpl);
            }
        return through.obj(function(dir, e, c) {
            build = build.bind(this);
            build(dir.path, dir.path, output, function() {
                if(!buildSubModule){
                    c();
                }else{
                    builder.scanFiles(dir.path, null, function(f, isDir, _c) {
                        if (isDir) {
                            var n = f.replace(/.*[\\/]/g, '');
                            if (!dirReg.test(n)) {
                                _c();
                                return;
                            }
                            build(dir.path, f, n, _c);
                        } else {
                            _c();
                        }
                    }.bind(this), c);
                }
            }.bind(this));
        });
    }
}
module.exports = builder;
