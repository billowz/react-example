let {is} = require('./core'),
  binding = '$observer',
  cfgBinding = '$observeConfig',
  arrayMethods = ["pop", "push", "reverse", "shift", "sort", "splice", "unshift"];
class Observe {
  constructor(target) {
    if (target[binding]) {
      throw binding + ' is defined.';
    }
    this.target = target;
    this.listeners = [];
    Object.defineProperty(target, binding, {
      enumerable: false,
      configurable: true,
      writable: false,
      value: this
    });
    if (is.array(target)) {
      this.mock(target);
      this.defineObserveCfg(target).path = [];
    }
  }
  destory() {
    this.unwatch(this.target);
    delete this.target[binding];
    delete this.target;
    delete this.listeners;
  }
  onPropChanged(prop, value, oldValue, target, path) {
    if (value !== oldValue && this.listeners) {
      let rootName = path[0],
        i = 0, lis;
      for (; i < this.listeners.length; i++) {
        lis = this.listeners[i];
        if (lis.all ||
          lis.watchAttrs.indexOf(rootName) != -1 ||
          rootName.indexOf("Array-") === 0) {
          lis.handler.call(this.target, prop, value, oldValue, path.concat(prop));
        }
      }
      this.unwatch(oldValue);
      this._watchChild(value, path.concat(prop));
    }
  }
  mock(target) {
    let _self = this;
    arrayMethods.forEach(function(methodName) {
      Object.defineProperty(target, methodName, {
        enumerable: false,
        configurable: true,
        writable: false,
        value: function() {
          let oldVal = Array.prototype.slice.call(this, 0),
            result = Array.prototype[methodName].apply(this, arguments),
            path = _self.getObserveCfg(this).path;
          Object.keys(this).forEach((idx) => {
            _self.watch(this, idx, path);
          });
          _self.onPropChanged("Array-" + methodName, this, oldVal, this, path);
          return result;
        }
      });
    });
  }
  _watchChild(target, path) {
    if (typeof target === 'object') {
      if (is.array(target)) {
        this.mock(target);
        if (!this.hasObserveCfg(target)) {
          this.defineObserveCfg(target).path = path;
        }
      }
      Object.keys(target).forEach(prop => {
        this.watch(target, prop, path);
      });
    }
  }
  watch(target, attr, path) {
    if (attr === binding || is.fn(target[attr])) {
      return;
    }
    if (!path) {
      path = [];
    }
    let cfg = this.getObserveCfg(target), watchAttrs;
    if (!cfg) {
      cfg = this.defineObserveCfg(target);
      cfg.path = path;
    }
    watchAttrs = cfg.watchAttrs;

    if (!watchAttrs[attr]) {
      let _self = this;

      watchAttrs[attr] = {
        current: target[attr]
      };

      Object.defineProperty(target, attr, {
        get: function() {
          return _self.getObserveCfg(this).watchAttrs[attr].current;
        },
        set: function(value) {
          let cfg = _self.getObserveCfg(this),
            watchAttrs = cfg.watchAttrs,
            oldVal;
          watchAttrs[attr].prev = oldVal = watchAttrs[attr].current;
          watchAttrs[attr].current = value;
          _self.onPropChanged(attr, value, oldVal, this, cfg.path);
        }
      });
      this._watchChild(watchAttrs[attr].current, path.concat(attr));
    }
  }
  unwatch(target) {
    let cfg = this.getObserveCfg(target);
    if (cfg) {
      if (is.array(target)) {
        arrayMethods.forEach(function(methodName) {
          delete target[methodName];
        });
      }
      Object.keys(cfg.watchAttrs).forEach((attr) => {
        let attrCfg = cfg.watchAttrs[attr];
        if (typeof target[attr] === 'object') {
          this.unwatch(target[attr]);
        }
        delete target[attr];
        target[attr] = attrCfg.current;
      });
      this.cleanObserveCfg(target);
    }
  }
  hasObserveCfg(target) {
    return !!target[cfgBinding];
  }
  getObserveCfg(target) {
    return target[cfgBinding];
  }
  defineObserveCfg(target) {
    Object.defineProperty(target, cfgBinding, {
      enumerable: false,
      configurable: true,
      writable: false,
      value: {
        path: [],
        watchAttrs: {}
      }
    });
    return target[cfgBinding];
  }
  cleanObserveCfg(target) {
    delete target[cfgBinding];
  }
  addListener(attrs, callback) {
    if (is.fn(attrs)) {
      callback = attrs;
      attrs = undefined;
    }
    if (!is.fn(callback)) {
      throw 'Invalid Observe Listener ' + callback;
    }
    let watchAttrs = this.parsewatchAttrs(attrs);
    if (watchAttrs.all || watchAttrs.attrs.length > 0) {
      watchAttrs.attrs.forEach(attr => {
        this.watch(this.target, attr);
      });
      this.listeners.push({
        all: watchAttrs.all,
        handler: callback,
        watchAttrs: watchAttrs.attrs
      });
    }
  }
  removeListener(attrs, callback) {
    if (is.fn(attrs)) {
      callback = attrs;
      attrs = undefined;
    }
    let lis, clean,
      i = 0,
      all = !(is.array(attrs) && attrs.length > 0);
    this.listeners = this.listeners.filter(lis => {
      if (!callback) {

      } else if (lis.handler === callback) {
        if (all) {
          return false;
        } else if (!lis.all && !all) {
          attrs.forEach(attr => {
            let idx;
            if ((idx = lis.watchAttrs.indexOf(attr)) != -1) {
              lis.watchAttrs.splice(idx, 1);
            }
          });
          return lis.watchAttrs.length > 0
        }
      }
      return true;
    });
  }
  parsewatchAttrs(attrs) {
    let all;
    if (is.string(attrs)) {
      attrs = [attrs];
      all = false;
    } else if (is.array(attrs) && attrs.length > 0) {
      attrs = attrs.filter(function(attr) {
        return is.string(attr);
      });
      all = false;
    } else {
      attrs = Object.keys(this.target);
      all = true;
    }
    return {
      all: all,
      attrs: attrs
    };
  }
}
function observe(target, attrs, handler) {
  let obs = target[binding];
  if (!obs) {
    obs = new Observe(target);
  }
  obs.addListener(attrs, handler);
  return function() {
    unobserve(target, attrs, handler);
  }
}
function unobserve(target, attrs, handler) {
  let obs = target[binding];
  if (obs) {
    obs.removeListener(attrs, handler);
    if (obs.listeners.length == 0) {
      obs.destory();
    }
  }
}
observe.unobserve = unobserve;
module.exports = observe;
