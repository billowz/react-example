
/**!
 * React UI Module:/event
 */
var Util = require('../util/util'),
  {array, is} = Util;
class Event {
  constructor(opt) {
    this._listeners = {};
    this._eventTypes = [];
    this.__scope__ = this;
    if (opt) {
      if (opt.eventTypes) {
        this.eventTypes(opt.eventTypes);
      }
      if (opt.listeners) {
        this.on(opt.listeners);
      }
    }
  }

  eventTypes() {
    var arg,
      i = 0,
      ret = [];
    for (; i < arguments.length; i++) {
      arg = arguments[i];
      if (is.array(arg)) {
        Array.prototype.push.apply(ret, this.eventTypes.apply(this, arg));
      } else if (is.string(arg)) {
        Array.prototype.push.apply(ret, array.uniquePush(this._eventTypes, arg));
      }
    }
    return ret;
  }

  on(evt, callback) {
    if (is.string(evt) && is.fn(callback)) {
      if (this._eventTypes.indexOf(evt) === -1) {
        console.warn('event name is undefined.', this, arguments);
      }
      if (!is.array(this._listeners[evt])) {
        this._listeners[evt] = [];
      }
      array.uniquePush(this._listeners[evt], callback);
      return this.un.bind(this, evt, callback);
    } else if (arguments.length === 1) {
      if (is.array(evt)) {
        return Util.chainedFunc(evt.map(function(evt) {
          return this.on(evt.type, evt.handler);
        }.bind(this)), this);
      } else if (is.hash(evt)) {
        return Util.chainedFunc(Object.keys(evt).map(function(type) {
          return this.on(type, evt[type]);
        }.bind(this)), this);
      }
    }
    throw 'Invalid Param';
  }

  un(evtname, callback) {
    let handlers = this._listeners[evtname];
    if (is.array(handlers)) {
      array.remove(handlers, callback);
    }
  }

  hasListener(evtname, callback) {
    let handlers = this._listeners[evtname],
      idx;
    if (is.array(handlers) && (idx = handlers.indexOf(callback) !== -1)) {
      return true;
    }
    return false;
  }

  fire(evtname, ...args) {
    let handlers = this._listeners[evtname];
    if (is.array(handlers)) {
      handlers.forEach(function(h) {
        h.apply(this.__scope__, args);
      }.bind(this));
    }
  }
}
module.exports = Event;
