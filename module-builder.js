var path = require('path'),
    gutil = require('gulp-util'),
    through = require('through2'),
    fs = require('fs'),
    ejs = require('ejs'),
    is = require('is');

var builder = {
    fileStat: function(path, callback) {
        if (callback) {
            fs.stat(path, function(err, stat) {
                if (err) {
                    throw new Error(err);
                }
                callback(stat);
            });
        } else {
            return fs.statSync(path);
        }
    },
    scanFiles: function(dir, dirFilter, callback, end) {
        fs.readdir(dir, function(err, files) {
            if (files.length === 0) {
                end();
                return;
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
                builder.fileStat(fpath, function(stat) {
                    if (stat.isDirectory()) {
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
                });
            });
        });
    },
    extend: function() {
        var target = arguments[0] || {};
        var i = 1;
        var length = arguments.length;
        var deep = false;
        var options, name, src, copy, clone, copyIsArray;

        // Handle a deep copy situation
        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (!is.object(target) && !is.fn(target) && !is.array(target)) {
            target = {};
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            options = arguments[i];
            if (options != null) {
                if (typeof options === 'string') {
                    options = options.split('');
                }
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (is.hash(copy) || (copyIsArray = is.array(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && is.array(src) ? src : [];
                        } else {
                            clone = src && is.hash(src) ? src : {};
                        }
                        // Never move original objects, clone them
                        target[name] = builder.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (typeof copy !== 'undefined') {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    },
    _MODULE_GENERATOR: '/*@MODULE_GENERATOR@*/'
};

function checkArray(arr) {
    arr = arr || [];
    if (!Array.isArray(arr)) {
        arr = [arr];
    }
    return arr;
}

function checkReg(str, includes, excludes) {
    includes = checkArray(includes);
    excludes = checkArray(excludes);
    for (var i = 0; i < includes.length; i++) {
        var reg = new RegExp(includes[i]);
        if (!reg.test(str)) {
            return false;
        }
    }
    for (var i = 0; i < excludes.length; i++) {
        var reg = new RegExp(excludes[i]);
        if (reg.test(str)) {
            return false;
        }
    }
    return true;
}

var _parseOutputFileName = function(out, dir) {
    if (is.string(out)) {
        return out;
    }
    if (is.fn(out)) {
        return out(dir);
    } else {
        throw new Error('invalid output:' + out);
    }
}

function _parseOutput(out, dir) {
    var filename = _parseOutputFileName(out, dir),
        existing = false;
    if (fs.existsSync(path.join(dir, filename + '.js'))) {
        filename = filename + '.js';
        existing = true;
    } else if (fs.existsSync(path.join(dir, filename + '.jsx'))) {
        filename = filename + '.jsx';
        existing = true;
    } else {
        filename = filename + '.js';
        existing = false;
    }
    return {
        filename: filename,
        existing: existing,
        path: path.join(dir, filename)
    }
}

function _parseModuleName(name) {
    name = name.replace(/[^a-zA-Z0-9][a-z]?/g, function(w) {
        if (w.length === 1) {
            return '';
        }
        return w[1].toUpperCase();
    });
    return name.substr(0, 1).toUpperCase() + name.substr(1);
}

function _scanDir(rootPath, basePath, dirPath, callback, end) {
    builder.scanFiles(dirPath, function() {
        return false
    }, function(filePath, isDir, c) {
        var relativePath = filePath.substr(basePath.length + 1).replace(/[\\]/g, '/'),
            rootRelativePath = filePath.substr(rootPath.length + 1).replace(/[\\]/g, '/');
        callback(rootRelativePath, relativePath, filePath, isDir, c);
    }, function() {
        end();
    });
}

function _moduleObj(moduleName, basepath, relativePath, isDirModule) {
    var obj = {
        name: moduleName,
        relativePath: relativePath
    }
    return obj;
}

function _buildModule(rootPath, basePath, dirPath, cascade, includeDir, includes, excludes, end) {
    var modules = [];
    _scanDir(rootPath, basePath, dirPath, function(rootRelativePath, relativePath, absPath, isDir, c) {
        if (!isDir) {
            if (checkReg(rootRelativePath, includes, excludes)) {
                var moduleName = _parseModuleName(relativePath.replace(/[/]/g, '_').replace(/\.[^\.]*$/, ''));
                modules.push(_moduleObj(moduleName, basePath, './' + relativePath.replace(/\.[^\.]*$/, ''), false));
            }
            c();
        } else {
            if (includeDir) {
                var dirModuleFile;
                if (is.fn(includeDir)) {
                    dirModuleFile = includeDir(relativePath);
                } else if (is.string(includeDir)) {
                    dirModuleFile = includeDir;
                } else {
                    dirModuleFile = relativePath.replace(/.*\//g, '')
                }
                if (checkReg(rootRelativePath + '/' + dirModuleFile + '.js', includes, excludes)) {
                    var moduleName = _parseModuleName(relativePath.replace(/[/]/g, '_').replace(/\.[^\.]*$/, ''));
                    modules.push(_moduleObj(moduleName, basePath, './' + relativePath + '/' + dirModuleFile, true));
                }
            }
            if (cascade) {
                _buildModule(rootPath, basePath, absPath, cascade, includeDir, includes, excludes, function(cmodules) {
                    Array.prototype.push.apply(modules, cmodules);
                    c();
                });
            } else {
                c();
            }
        }
    }, function() {
        end(modules);
    });
}

function _buildDoc(rootPath, basePath, dirPath, includes, excludes, end) {
    var modules = [],
        relativePath = dirPath.substr(basePath.length + 1).replace(/[\\]/g, '/'),
        rootRelativePath = dirPath.substr(rootPath.length + 1).replace(/[\\]/g, '/');
    if (!checkReg(rootRelativePath, includes, excludes)) {
        builder.scanFiles(dirPath, function() {
            return false
        }, function(filePath, isDir, c) {
            if (isDir) {
                _buildDoc(rootPath, basePath, filePath, includes, excludes, function(ms) {
                    modules = modules.concat(ms);
                    c();
                });
            } else {
                c();
            }
        }, function() {
            end(modules);
        });
    } else {
        var module = {
            name: _parseModuleName(relativePath.replace(/\/doc/, '')),
            demos: {},
            readmes: {}
        };
        modules.push(module);
        builder.scanFiles(dirPath, function() {
            return false
        }, function(filePath, isDir, c) {
            if (!isDir) {
                var fileName = filePath.replace(/.*[\\/]/g, '').replace(/\.[^\.]*$/, ''),
                    name = _parseModuleName(fileName);
                if (/\.md$/.test(filePath)) {
                    module.readmes[name] = fs.readFileSync(filePath, 'utf-8').toString();
                } else if (/\.jsx?$/.test(filePath)) {
                    module.demos[name] = {
                        path: './' + relativePath + '/' + fileName,
                        content: fs.readFileSync(filePath, 'utf-8').toString()
                    }
                }
            }
            c();
        }, function() {
            end(modules);
        });
    }
}

builder.buildModule = function(option) {
    var tpl = option.tpl || '',
        output = option.out || 'index',
        includes = (option.includes || []).concat([/\.jsx?$/]),
        excludes = (option.excludes || []).concat([]);
    return through.obj(function(dir, e, c) {
        var _build = function(_path, out, c) {
            if ((out.existing && fs.readFileSync(out.path, 'utf-8').indexOf(builder._MODULE_GENERATOR) !== 0) || !checkReg(out.path.substr(dir.path.length + 1).replace(/[\\]/g, '/'), includes, excludes)) {
                c();
                return;
            }

            var _excludes = excludes;
            if (out.existing) {
                _excludes = _excludes.concat('^' + out.path.substr(dir.path.length + 1).replace(/[\\]/g, '/').replace('\.', '\\.') + '$')
            }
            _buildModule(dir.path, _path, _path, false, true, includes, _excludes,
                function(modules) {
                    var _file = new gutil.File({
                        base: dir.path,
                        path: out.path,
                        contents: new Buffer(
                            builder._MODULE_GENERATOR + '\n' + ejs.render(tpl, {
                                modules: modules
                            }))
                    });
                    gutil.log('build module: ' + _file.path + '\n' + _file.contents);
                    this.push(_file);

                    builder.scanFiles(_path, function() {
                        return false
                    }, function(filePath, isDir, c) {
                        if (isDir) {
                            _build(filePath, _parseOutput(output, filePath), c);
                        } else {
                            c();
                        }
                    }, c);
                }.bind(this));
        }.bind(this);
        _build(dir.path, _parseOutput(output, dir.path), c);
    });
}

builder.buildDoc = function(option) {
    var tpl = option.tpl || '',
        output = option.out || 'doc',
        includes = (option.includes || []),
        excludes = (option.excludes || []);
    return through.obj(function(dir, e, c) {
        var out = _parseOutput(output, dir.path);
        if (out.existing && fs.readFileSync(out.path, 'utf-8').indexOf(builder._MODULE_GENERATOR) !== 0) {
            return;
        }
        _buildDoc(dir.path, dir.path, dir.path, includes, excludes,
            function(modules) {
                var _file = new gutil.File({
                    base: dir.path,
                    path: out.path,
                    contents: new Buffer(
                        builder._MODULE_GENERATOR + '\n' + ejs.render(tpl, {
                            modules: modules
                        }))
                });
                gutil.log('build module: ' + _file.path + '\n' + _file.contents)
                this.push(_file);;
                c();
            }.bind(this));
    });
}
module.exports = builder;
