var path = require('path'),
    gutil = require('gulp-util'),
    through = require('through2'),
    fs = require('fs'),
    gulp = require('gulp'),
    ejs = require('ejs'),
    rimraf = require('rimraf'),
    is = require('is');

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
    extend: function() {
        var target = arguments[0] || {};
        var i = 1;
        var length = arguments.length;
        var deep = false;
        var options, name, src, copy, clone;

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

function _scanDirModules(baseDir, dir, opt, dirCallback, end) {
    var modules = [];
    gutil.log('scan ' + dir)
    builder.scanFiles(dir, function() {
        return false
    }, function(filePath, isDir, c) {
        var relativePath = filePath.substr(dir.length + 1).replace(/[\\]/g, '/');
        var reg = isDir ? opt.dirReg : opt.fileReg;
        if (!checkReg(relativePath, reg.include, reg.exclude)) {
            c();
            return;
        }
        if (!isDir) {
            var moduleName = relativePath.replace(/[/]/g, '_').replace(/\.[^\.]*$/, '');
            var modulePath = './' + relativePath.replace(/\.[^\.]*$/, '');
            moduleName = builder.parseModuleName(moduleName);
            modules.push({
                name: moduleName,
                path: modulePath
            });
            c();
        } else {
            dirCallback({
                baseDir: baseDir,
                dir: filePath,
                relativePath: relativePath,
                opt: opt,
                modules: modules
            }, c);
        }
    }, function() {
        end(modules);
    });
}

function _buildModule(basePath, dirPath, opt, c) {
    var output = _parseOutput(opt.out, dirPath, basePath === dirPath) + '.js',
        tpl = opt.tpl || '',
        dirCallback = opt.dirCallback,
        outputPath,
        hasFile = false;

    if (!fs.existsSync(path.join(dirPath, output))) {
        if ((hasFile = fs.existsSync(path.join(dirPath, output + 'x')))) {
            output = output + 'x';
        }
    } else {
        hasFile = true;
    }
    outputPath = path.join(dirPath, output);
    if (hasFile && fs.readFileSync(outputPath, 'utf-8')
        .indexOf(builder._MODULE_GENERATOR) !== 0) {
        c();
        return;
    }

    gutil.log('building module: ' + output);
    opt.fileReg.exclude.push(new RegExp('^' + output.replace(/\//g, '\/').replace(/\./g, '\\.') + '$'));

    _scanDirModules(basePath, dirPath, opt, dirCallback,
        function(modules) {
            var _file = new gutil.File({
                base: basePath,
                path: outputPath,
                contents: new Buffer(
                    builder._MODULE_GENERATOR + '\n/*' + new Date().toGMTString() + '*/\n' + ejs.render(tpl, {
                        modules: modules
                    }))
            });
            gutil.log('build module: ' + _file.path + '\n' + _file.contents)
            this.push(_file);;
            c();
        }.bind(this));
    return output;
}
var _parseOutput = function(out, dir, root) {
    if (is.string(out)) {
        return out;
    }
    if (is.fn(out)) {
        return out(dir, root);
    } else {
        throw new Error('invalid output:' + out);
    }
}
var initOpt = function(opt) {
    opt = opt || {};
    opt.fileReg = opt.fileReg || {};
    opt.dirReg = opt.dirReg || {};
    opt.fileReg.include = checkArray(opt.fileReg.include);
    opt.fileReg.exclude = checkArray(opt.fileReg.exclude);
    opt.dirReg.include = checkArray(opt.dirReg.include);
    opt.dirReg.exclude = checkArray(opt.dirReg.exclude);
    return opt;
}
builder.buildDoc = function(opts) {
    opts = initOpt(opts);
    opts.out = opts.out || 'doc';
    option.fileReg.include.push(/\.jsx?$/g);
    opts.dirReg.include.push(/(^doc\/)|(\/doc\/)/g);
    var dirCallback = function(opt, c) {
        _scanDirModules(opt.baseDir, opt.dir, opt.opt, opts.dirCallback,
            function(modules) {
                opt.modules.push.apply(opt.modules, modules);
                c();
            });
    };
    return through.obj(function(dir, e, c) {
        var _builder = _buildModule.bind(this);
        opts.dirCallback = dirCallback.bind(this);
        _builder(dir.path, dir.path, opts, c);
    });

}
builder.buildModule = function(option) {
    option = initOpt(option);
    option.out = option.out || 'index';
    option.fileReg.include.push(/\.jsx?$/g);
    option.dirReg.exclude.push(/(^doc$)|(^doc\/)|(\/doc\/)|(\/doc$)/g);
    return through.obj(function(dir, e, c) {
        var _builder = _buildModule.bind(this);
        var dirCallback = function(opt, c) {
            var relativePath = opt.relativePath,
                modules = opt.modules,
                copt = builder.extend(true, {}, option),
                fileReg = copt.fileReg || {};
            var moduleName = relativePath.replace(/[/]/g, '_').replace(/\.[^\.]*$/, '');
            var modulePath = './' + relativePath + '/' + _parseOutput(option.out, opt.dir, false);
            moduleName = builder.parseModuleName(moduleName);
            opt.modules.push({
                name: moduleName,
                path: modulePath
            });
            _builder(dir.path, opt.dir, copt, c);
        };
        option.dirCallback = dirCallback.bind(this);
        _builder(dir.path, dir.path, builder.extend(true, {}, option), c);
    });
};

module.exports = builder;
