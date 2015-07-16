var path = require('path'),
    gutil = require('gulp-util'),
    through = require('through2'),
    fs = require('fs'),
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
    build: function(output, reg, dirReg) {
        reg = reg || '(\\.js)x?$';
        reg = new RegExp(reg);
        dirReg = new RegExp(dirReg);
        var build = function(baseDir, dir, output, c) {
            output = output || 'index';
            var existingFilePath = path.join(dir, output + '.js'),
                gen = true;
            if (fs.existsSync(existingFilePath)) {
                var dat = fs.readFileSync(existingFilePath, 'utf-8');
                if (dat.indexOf(builder._MODULE_GENERATOR) !== 0) {
                    gen = false;
                }
            } else {
                existingFilePath = path.join(dir, output + '.jsx');
                var dat = fs.readFileSync(existingFilePath, 'utf-8');
                if (dat.indexOf(builder._MODULE_GENERATOR) !== 0) {
                    gen = false;
                }
            }
            if (!gen) {
                gutil.log('skip module: ' + output + ' ' + existingFilePath);
                c();
                return;
            }

            gutil.log('parse module: ' + output);
            var modules = [];
            builder.scanFiles(dir, function() {
                return false
            }, function(_f, _isdir, _c) {
                var fileName, modulePath, moduleName;
                _f = _f.replace(/.*[\\/]/g, '');
                if (_isdir) {
                    fileName = _f;
                    modulePath = './' + _f + '/' + _f;
                    moduleName = builder.parseModuleName(fileName);
                    if (!dirReg.test(_f)) {
                        _c();
                        return;
                    }
                } else {
                    fileName = _f.replace(/\.[^\.]*$/, '');
                    modulePath = './' + fileName;
                    moduleName = builder.parseModuleName(fileName);
                    if (!reg.test(_f)) {
                        gutil.log('skip child module: ' + output + '.' + moduleName);
                        _c();
                        return;
                    }
                }
                modules.push('\t' + moduleName + ': require("' + modulePath + '")');
                gutil.log('parse module: ' + output + '->' + moduleName);
                _c();
            }, function() {
                var _contents = builder._MODULE_GENERATOR + '\nmodule.exports={\n' + modules.join(',\n') + '\n};\n';
                var _file = new gutil.File({
                    base: baseDir,
                    path: path.join(dir, output + '.js'),
                    contents: new Buffer(_contents),
                });
                this.push(_file);
                gutil.log('build module: ' + _file.path + '\n' + _contents);
                c();
            }.bind(this));
        }
        return through.obj(function(dir, e, c) {
            build = build.bind(this);
            build(dir.path, dir.path, output, function() {
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
            }.bind(this));
        });
    }
}
module.exports = builder;
