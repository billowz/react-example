let Util = require('../util/util'),
  {is} = Util,
  Event = require('../event/event'),
  Adapter = require('./adapter');

class DataPovider extends Event {
  constructor(opt) {
    opt = opt || {};
    super({
      eventTypes: ['progress', 'update'],
      listeners: opt.listeners
    });
    if (opt.adapter) {
      if (is.instance(opt.adapter, Adapter)) {
        this.adapter = opt.adapter;
      } else {
        throw 'Invalid Data Adapter';
      }
    }
    this._subscribing = [];
    this._unsubscribing = [];
  }
  _getData(success, fail, progress) {
    throw 'abstract method';
  }

  subscribe(init, handler, fail) {
    let pomise = this.getData();
    if (this.hasListener('update', handler)
      || this._subscribing.indexOf(handler) !== -1) {
      pomis.then(init).fail(fail);
    } else {
      this._subscribing.push(handler);
      pomise.then(function() {
        let sidx = this._subscribing.indexOf(handler),
          usidx = this._unsubscribing.indexOf(handler);
        init.apply(this, arguments);
        if (usidx === -1) {
          this.on('update', handler);
        } else {
          this._unsubscribing.splice(usidx, 1);
        }
        this._subscribing.splice(sidx, 1);
      }.bind(this)).fail(fail);
    }
  }

  unsubscribe(handler) {
    if (this._subscribing.indexOf(handler) !== -1) {
      this._unsubscribing.push(handler);
    } else {
      this.un('update', handler);
    }
  }

  getData(success, fail, progress) {
    let pomise = Util.promise(function(def) {
      return this._getData(function(data) {
        data = this.adapter ? this.adapter.convert(data) : data;
        def.resolve(data);
      }.bind(this), function() {
        def.reject.apply(def, arguments);
      }, function() {
        def.notify.apply(def, arguments);
      });
    }.bind(this));
    if (is.fn(success)) {
      pomise.then(success);
    }
    if (is.fn(fail)) {
      pomise.fail(fail);
    }
    if (is.fn(progress)) {
      pomise.progress(progress);
    }
    return pomise;
  }
}

module.exports = DataPovider;
