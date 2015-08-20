let {is} = require('./core'),
  binding = '$observer',
  propBinding = '$observeProps',
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
  }
  onPropChanged(prop, value, oldValue, target, path) {
    if (value !== oldValue && this.propertyChangedHandler) {
      let rootName = observe._getRootName(prop, path),
        i = 0, handler, len;
      for (len = this.propertyChangedHandler.length; i < len; i++) {
        handler = this.propertyChangedHandler[i];
        if (handler.all || handler.eventPropArr.indexOf(rootName) != -1 || rootName.indexOf("Array-") === 0) {
          handler.propChanged.call(this.target, prop, value, oldValue, path);
        }
      }
    }
    if (prop.indexOf("Array-") !== 0 && typeof value === "object") {
      this.watch(target, prop, target.$observeProps.$observerPath);
    }
  }
  mock(target) {
    let _self = this;
    arrayMethods.forEach(function(item) {
      target[item] = function() {
        let oldVal = Array.prototype.slice.call(this, 0),
          result = Array.prototype[item].apply(this, arguments),
          path = _self.getObserveProps(this).path;
        Object.keys(this).forEach(function(idx) {
          _self.watch(this, idx, path);
        });
        self.onPropChanged("Array-" + item, this, old, this, this.$observeProps.$observerPath);
        return result;
      };
    });
  }
  watch(target, attr, path) {
    if (attr === binding || is.fn(target[attr])) {
      return;
    }
    if (!path) {
      path = [];
    }
    let observeProps = this.getObserveProps(target);
    if (!observeProps) {
      observeProps = this.defineObserveProps(target);
    }
    observeProps.path = path;

    if (!observeProps[attr]) {
      let _self = this,
        currentValue = target[attr];

      observeProps[attr] = {
        current: currentValue
      };

      Object.defineProperty(target, attr, {
        get: function() {
          return _self.getObserveProps(this)[attr].current;
        },
        set: function(value) {
          let observeProps = _self.getObserveProps(this),
            oldVal;
          observeProps[attr].prev = oldVal = observeProps[attr].current;
          observeProps[attr].current = value;
          self.onPropChanged(attr, value, oldVal, this, observeProps.path);
        }
      });

      if (typeof currentValue === 'object') {
        if (is.array(currentValue)) {
          this.mock(currentValue);
          if (currentValue.length === 0 && !this.hasObserveProps(currentValue)) {
            this.defineObserveProps(currentValue).path = path;
          }
        }
        Object.keys(currentValue).forEach(prop => {
          this.watch(currentValue, prop, path.concat(prop));
        });
      }
    }
  }
  hasObserveProps(target) {
    return !!target[propBinding];
  }
  getObserveProps(target) {
    return target[propBinding];
  }
  defineObserveProps(target) {
    Object.defineProperty(target, propBinding, {
      enumerable: false,
      configurable: true,
      writable: false,
      value: {}
    });
    return target[propBinding];
  }
  addListener(attrs, callback) {
    if (is.fn(attrs)) {
      callback = attrs;
      attrs = undefined;
    }
    if (!is.fn(callback)) {
      throw 'Invalid Observe Listener ' + callback;
    }
    let eventAttrs = this.parseEventAttrs(attrs);
    if (eventAttrs.all || eventAttrs.length > 0) {
      eventAttrs.forEach(attr => {
        this.watch(target, attr);
      })
      this.listeners.push({
        all: eventAttrs.all,
        handler: callback,
        eventAttrs: eventAttrs.attrs
      });
    }
  }
  removeListener(callback) {
    if (!is.fn(callback)) {
      throw 'Invalid Observe Listener ' + callback;
    }
    let lis,
      i = 0;
    for (; i < this.listeners.length; i++) {
      lis = this.listeners[i];
      if (lis.handler === callback) {
        this.listeners.splice(i, 1);
        i--;
      }
    }
  }
  parseEventAttrs(attrs) {
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
      attrs = Object.keys(target);
      all = true;
    }
    return {
      all: all,
      attrs: attrs
    };
  }
}
module.exports = Observe;
