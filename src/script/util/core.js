let q = require('q'),
  is = require('is');
function _arrayEmptyFilter(v) {
  return v;
}
function callconsole(fn, ...args) {
  if (console && console[fn]) {
    return console[fn].apply(console, args);
  }
}
function _assign(target, keyFilter, ...sources) {
  target = target || {};
  sources.forEach(function(source) {
    if (is.hash(source)) {
      let keys = Object.keys(source);
      if (keyFilter) {
        keys = keys.filter(keyFilter);
      }
      keys.forEach(function(key) {
        target[key] = source[key];
      });
    }
  });
  return target;
}
let core = {
  is: is,
  debug(...args) {
    callconsole('debug', args);
  },
  log(...args) {
    callconsole('log', args);
  },
  warn(...args) {
    callconsole('warn', args);
  },
  consoleGroup(callback, ...args) {
    callconsole('group', args);
    callback();
    callconsole('groupEnd');
  },
  consoleTime(callback, ...args) {
    callconsole('time', args);
    callback();
    callconsole('time', args);
  },
  err(...args) {
    callconsole('error', args);
  },
  promise(c) {
    let def = Q.defer();
    c(def);
    return def.promise;
  },
  promiseAll(promises) {
    if (!is.array(promises)) {
      promises = [];
      for (var i = 0; i < arguments.length; i++) {
        promises[i] = arguments[i];
      }
    }
    return Q.promise.all(promises);
  },
  arrayEmptyFilter: _arrayEmptyFilter,
  emptyFn() {},
  parseClassName(classNames) {
    if (!classNames) {
      return '';
    }
    if (is.array(classNames)) {
      return classNames.join(' ');
    } else if (is.hash(classNames)) {
      return Object.keys(classNames).filter(function(className) {
        return classNames[className];
      }).join(' ');
    } else {
      return Array.prototype.filter.call(arguments, _arrayEmptyFilter).join(' ');
    }
  },

  parseIconClassName(iconCls) {
    let iconClasses,
      isFa = false,
      i;
    if (!iconCls) {
      return '';
    }
    if (is.string(iconCls)) {
      iconClasses = iconCls ? iconCls.split(/\s+/g) : []
    } else if (is.array(iconCls)) {
      iconClasses = iconCls;
    } else if (is.hash(iconCls)) {
      iconClasses = Object.keys(classNames).filter(function(className) {
        return classNames[className];
      });
    } else {
      throw new Error('Invalid param', arguments);
    }
    for (i = 0; i < iconClasses.length; i++) {
      if (iconClasses[i].indexOf('fa-') == 0) {
        isFa = true;
      }
    }
    if (isFa && iconClasses.indexOf('fa') === -1) {
      iconClasses.splice(0, 0, 'fa');
    }
    return iconClasses.join(' ');
  },

  objectWithoutProperties() {
    return _objectWithoutProperties.apply(this, arguments);
  },

  chainedFunc(...funcs) {
    return funcs
      .filter(f => is.fn(f))
      .reduce((acc, f) => {
        if (acc === null) {
          return f;
        }
        return function chainedFunction(...args) {
          acc.apply(this, args);
          f.apply(this, args);
        };
      }, null);
  },

  pushDistinctArray(array, ...vals) {
    if (!is.array(array)) {
      throw 'Invalid Array';
    }
    if (arguments.length == 2) {
      vals = vals[0];
    }
    if (!is.array(vals)) {
      vals = [vals];
    }
    vals.forEach(function(val) {
      if (array.indexOf(val) == -1) {
        array.push(val);
      }
    });
    return array;
  },

  removeArrayValues(array, ...remVals) {
    if (!is.array(array)) {
      throw 'Invalid Array';
    }
    if (arguments.length == 2) {
      remVals = remVals[0];
    }
    if (!is.array(remVals)) {
      remVals = [remVals];
    }
    remVals.forEach(function(val) {
      let idx;
      while ((idx = array.indexOf(val)) != -1) {
        array.splice(idx, 1);
      }
    });
  },

  assign(target, ...sources) {
    return _assign.apply(this, [target, null].concat(sources));
  },

  assignWith(target, includes, ...srouces) {
    let keyFilter;
    if (is.array(includes) && includes.length > 0) {
      keyFilter = function(key) {
        return includes.indexOf(key) != -1;
      }
    }
    return _assign.apply(this, [target, keyFilter].concat(sources));
  },

  assignWithout(target, excludes, ...srouces) {
    let keyFilter;
    if (is.array(excludes) && excludes.length > 0) {
      keyFilter = function(key) {
        return excludes.indexOf(key) == -1;
      }
    }
    return _assign.apply(this, [target, keyFilter].concat(srouces));
  },

  upperFirst(str) {
    if (is.string(str)) {
      return str.replace(/^[a-z]/, function(w) {
        return w.toUpperCase();
      });
    }
    return str;
  },

  observe() {
    Object.observe();
  }
}
module.exports = core;
