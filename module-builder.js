var path = require('path'),
    gutil = require('gulp-util'),
    through = require('through2'),
    fs = require('fs'),
    gulp = require('gulp'),
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
        if (!includes[i].test(str)) {
            gutil.log('::'+str+' '+includes[i])
            return false;
        }
    }
    for (var i = 0; i < excludes.length; i++) {
        if (excludes[i].test(str)) {
            return false;
        }
    }
    return true;
}

function _scanDirModules(baseDir, dir, opt, dirCallback, end) {
    opt = opt || {};
    opt.fileReg = opt.fileReg || {};
    opt.dirReg = opt.dirReg || {};
    opt.fileReg.include = checkArray(opt.fileReg.include);
    opt.fileReg.exclude = checkArray(opt.fileReg.exclude);
    opt.dirReg.include = checkArray(opt.dirReg.include);
    opt.dirReg.exclude = checkArray(opt.dirReg.exclude);
    var modules = [];
    gutil.log('scan ' + dir)
    builder.scanFiles(dir, function() {
        return false
    }, function(filePath, isDir, c) {
        var relativePath = filePath.substr(baseDir.length + 1).replace(/[\\]/g, '/');
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
            gutil.log(reg.include[0]);
            dirCallback({
                baseDir: baseDir,
                dir: filePath,
                relativePath: relativePath,
                opt: opt,
                modules: modules
            }, c);
        }
    }, function() {
        gutil.log('scan end ' + dir)
        end(modules);
    });
}

function _buildModule(basePath, dirPath, opt, c) {
    opt = opt || {};
    var output = opt.out || 'index',
        fileReg = opt.fileReg || {},
        buildSubModule = opt.buildSubModule === false,
        tpl = opt.tpl || '',
        dirCallback = opt.dirCallback;
    fileReg.exclude = checkArray(fileReg.execute);
    var moduleFilePath = path.join(dirPath, output + '.jsx'),
        file, hasFile;
    if (!fs.existsSync(moduleFilePath)) {
        moduleFilePath = path.join(dirPath, output + '.js');
        hasFile = fs.existsSync(moduleFilePath);
    } else {
        hasFile = true;
    }
    if (hasFile) {
        if (fs.readFileSync(moduleFilePath, 'utf-8').indexOf(builder._MODULE_GENERATOR) !== 0) {
            c();
            return;
        }
    }
    var relativePath = moduleFilePath.substr(dirPath.length + 1).replace(/[\\]/g, '/');
    gutil.log('building module: ' + relativePath)
    fileReg.exclude.push(new RegExp('^' + relativePath.replace(/\//g, '\/').replace(/\./g, '\\.') + '$'));
    _scanDirModules(dirPath, dirPath, opt, dirCallback,
        function(modules) {
            var _file = new gutil.File({
                base: basePath,
                path: moduleFilePath,
                contents: new Buffer(
                    builder._MODULE_GENERATOR + '\n/*' + new Date().toGMTString() + '*/\n' + ejs.render(tpl, {
                        modules: modules
                    }))
            });
            gutil.log('build module: ' + _file.path + '\n' + _file.contents)
            this.push(_file);;
            c();
        }.bind(this));
}

function _build(opt) {
    return through.obj(function(dir, e, c) {
        var builder = _buildModule.bind(this);
        builder(dir.path, dir.path, opt, c);
    });
}
builder.buildDoc = function(opts) {
    opts.dirCallback = function(opt, c) {
        _scanDirModules(opt.baseDir, opt.dir, opt.opt, opts.dirCallback,
            function(modules) {
                opt.modules.push.apply(opt.modules, modules);
                c();
            });
    }
    return _build(opts);
}
builder.buildModule = function(opts) {
    opts.dirCallback = function(opt, c) {
        var relativePath = opt.relativePath,
            modules = opt.modules;
        var moduleName = relativePath.replace(/[/]/g, '_').replace(/\.[^\.]*$/, '');
        var modulePath = './' + relativePath + '/' + relativePath.replace(/.*\//g, '');
        moduleName = builder.parseModuleName(moduleName);
        modules.push({
            name: moduleName,
            path: modulePath
        });
        c();
    }
    return _build(opts);
};

module.exports = builder;
