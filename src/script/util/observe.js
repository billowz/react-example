let Util = require('./core'),
  {is} = Util,
  array = require('./array'),
  requestFrame = require('./request-frame'),
  binding = '$observer',
  objectSetBinding = '$set',
  objectDelBinding = '$del',
  defaultAccepts = ["add", "update", "delete"],
  changeRecords = new Map();
if (!Object.observe) {
  function eachChangeRecord(changes, handler) {
    if (changes.length > 0) {
      handler(changes);
      console.log('invoke ', changes, handler);
    }
  }
  function checkChange() {
    if (changeRecords.size > 0) {
      setTimeout(function() {
        changeRecords.forEach(eachChangeRecord);
        changeRecords = new Map();
      }, 0);
    }
    requestFrame.request(checkChange);
  }
  checkChange();
  class Observe {
    constructor(target) {
      if (target[binding]) {
        throw binding + ' is defined.';
      }
      this.target = target;
      this.handlers = {};
      this.watchAttrs = {};
      Object.defineProperty(target, binding, {
        enumerable: false,
        configurable: true,
        writable: false,
        value: this
      });
      if (is.array(target)) {
        this.mockArray();
      } else {
        this.mockObject();
      }
      Object.keys(target).forEach(this.watchAttr.bind(this));
    }
    objectMockCheck() {
      if (!this.objectMock) {
        this.objectMock = Util.assign({}, this.target);
      } else {
        let adds = Object.keys(this.target).filter(key => !(key in this.objectMock)),
          removes = Object.keys(this.objectMock).filter(key => !(key in this.target));
        if (adds.length > 0 || removes.length > 0) {
          adds.forEach(attr => {
            this.watchAttr(attr);
            this.addChangeRecord(attr, this.target[attr], undefined, 'add');
          });
          removes.forEach(attr => {
            this.unwatchAttr(attr);
            this.addChangeRecord(attr, undefined, this.objectMock[attr], 'delete');
          });
          this.objectMock = Object.assign({}, this.target);
        }
      }
      setTimeout(this.objectMockCheck.bind(this), 10000);
    //requestFrame.request(this.objectMockCheck.bind(this));
    }
    mockObject() {
      //this.objectMockCheck();
      let _self = this;
      if (!(objectSetBinding in this.target)) {
        this.setFn = function(attr, val) {
          let has = attr in this;
          this[attr] = val;
          if (!has) {
            _self.watchAttr(attr);
            _self.addChangeRecord(attr, val, undefined, 'add');
          }
          return this;
        };
        Object.defineProperty(this.target, objectSetBinding, {
          enumerable: false,
          configurable: true,
          writable: false,
          value: this.setFn
        });
      }
      if (!(objectDelBinding in this.target)) {
        this.delFn = function(attr) {
          let has = attr in this, val;
          if (has) {
            val = this[attr];
            _self.unwatchAttr(attr);
            delete this[attr];
            _self.addChangeRecord(attr, undefined, val, 'delete');
          }
        }
        Object.defineProperty(this.target, objectDelBinding, {
          enumerable: false,
          configurable: true,
          writable: false,
          value: this.delFn
        });
      }
    }
    mockArray() {
      let _self = this,
        arrayMocks = {
          push: function() {
            let ret, attr,
              len = this.length;
            ret = Array.prototype.push.apply(this, arguments);
            for (len++; len > 0 && len <= ret; len++) {
              attr = (len - 1) + '';
              _self.watchAttr(attr);
              _self.addChangeRecord(attr, this[attr], undefined, 'add');
            }
            return ret;
          },
          pop: function() {
            let ret, attr,
              len = this.length;
            ret = Array.prototype.pop.apply(this, arguments);
            if (len > 0) {
              attr = (len - 1) + '';
              _self.unwatchAttr(attr);
              _self.addChangeRecord(attr, undefined, ret, 'delete');
            }
            return ret;
          },
          shift: function() {
            let ret,
              attr = '0',
              len = this.length;
            ret = Array.prototype.shift.apply(this, arguments);
            if (len > 0) {
              _self.unwatchAttr(attr);
              _self.addChangeRecord(attr, undefined, ret, 'delete');
            }
            return ret;
          },
          unshift: function() {
            let ret, attr,
              len = this.length;
            ret = Array.prototype.unshift.apply(this, arguments);
            for (len++; len > 0 && len <= ret; len++) {
              attr = (len - 1) + '';
              _self.watchAttr(attr);
              _self.addChangeRecord(attr, this[attr], undefined, 'add');
            }
            return ret;
          },
          splice: function() {
            let ret, attr, newLen, oldval,
              len = this.length;
            ret = Array.prototype.splice.apply(this, arguments);
            newLen = this.length;
            if (len < newLen) {
              for (len++; len > 0 && len <= newLen; len++) {
                attr = (len - 1) + '';
                _self.watchAttr(attr);
                _self.addChangeRecord(attr, this[attr], undefined, 'add');
              }
            } else if (len > newLen) {
              for (newLen++; len > 0 && newLen <= len; newLen++) {
                attr = (newLen - 1) + '';
                oldval = _self.watchAttrs[attr];
                _self.unwatchAttr(attr);
                _self.addChangeRecord(attr, undefined, oldval, 'delete');
              }
            }
            return ret;
          }
        };
      Object.keys(arrayMocks).forEach(method => {
        Object.defineProperty(this.target, method, {
          enumerable: false,
          configurable: true,
          writable: false,
          value: arrayMocks[method]
        });
      });
    }
    watchAttr(attr) {
      if (!(attr in this.watchAttrs)) {
        let _self = this;
        this.watchAttrs[attr] = this.target[attr];
        Object.defineProperty(this.target, attr, {
          get: function() {
            return _self.watchAttrs[attr];
          },
          set: function(value) {
            let oldValue = _self.watchAttrs[attr];
            _self.watchAttrs[attr] = value;
            _self.addChangeRecord(attr, value, oldValue, 'update');
          }
        });
      }
    }
    unwatchAttr(attr) {
      if (attr in this.watchAttrs) {
        if (attr in this.target) {
          Object.defineProperty(this.target, attr, {
            get: undefined,
            set: undefined
          });
        }
        delete this.watchAttrs[attr];
      }
    }
    addChangeRecord(attr, value, oldValue, accept) {
      if (value !== oldValue) {
        let obj = {
          name: attr,
          object: this.target,
          oldValue: oldValue,
          type: accept
        };
        this.handlers[accept].forEach(handler => {
          let changes = changeRecords.get(handler);
          if (!changes) {
            changes = [];
            changeRecords.set(handler, changes);
          }
          changes.push(obj);
        });
      }
    }
    addHandler(handler, accepts) {
      accepts.forEach(accept => {
        if (defaultAccepts.indexOf(accept) != -1) {
          if (!this.handlers[accept]) {
            this.handlers[accept] = [];
          }
          if (this.handlers[accept].indexOf(handler) == -1) {
            this.handlers[accept].push(handler);
          }
        }
      });
    }
    removeHandler(handler, accepts) {
      accepts.forEach(accept => {
        let idx;
        if (defaultAccepts.indexOf(accept) != -1) {
          if (this.handlers[accept] && (idx = this.handlers[accept].indexOf(handler)) != -1) {
            this.handlers[accept].splice(idx, 1);
          }
        }
      });
    }
    hasHandler() {
      let i = 0,
        accepts = Object.keys(this.handlers), hs;
      for (; i < accepts.length; i++) {
        hs = this.handlers[accepts[i]];
        if (hs && hs.length > 0) {
          return true;
        }
      }
      return false;
    }
    destory() {
      if (this.setFn) {
        delete this.target[objectSetBinding]
      }
      if (this.delFn) {
        delete this.target[objectDelBinding]
      }
      Object.keys(this.target).forEach(this.unwatchAttr.bind(this));
      delete this.target[binding];
      delete this.target;
      delete this.handlers;
    }
  }

  Object.observe = function(object, handler, accepts) {
    if (!object || typeof object !== 'object') {
      throw new TypeError("Object.observe cannot observe non-object");
    }
    if (!is.fn(handler)) {
      throw new TypeError("Object.observe cannot deliver to non-function");
    }
    if (Object.isFrozen(handler)) {
      throw new TypeError("Object.observe cannot deliver to a frozen function object");
    }

    if (is.undef(accepts)) {
      accepts = defaultAccepts;
    } else if (!is.array(accepts)) {
      throw new TypeError("Third argument to Object.observe must be an array of strings.");
    }
    let observe = object[binding];
    if (!observe) {
      observe = new Observe(object);
    }
    observe.addHandler(handler, accepts);
    return object;
  }

  Object.unobserve = function(object, handler, accepts) {
    if (!object || typeof object !== 'object') {
      throw new TypeError("Object.observe cannot observe non-object");
    }
    if (!is.fn(handler)) {
      throw new TypeError("Object.observe cannot deliver to non-function");
    }
    if (Object.isFrozen(handler)) {
      throw new TypeError("Object.observe cannot deliver to a frozen function object");
    }
    if (is.undef(accepts)) {
      accepts = defaultAccepts;
    } else if (!is.array(accepts)) {
      throw new TypeError("Third argument to Object.observe must be an array of strings.");
    }
    let observe = object[binding];
    if (observe) {
      observe.removeHandler(handler, accepts);
      if (!observe.hasHandler()) {
        observe.destory();
      }
    }
    return object;
  }
}
module.exports = {
  observe: Object.observe,
  unobserve: Object.unobserve
}
