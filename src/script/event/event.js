let is = require('is');
class Event {
    constructor(opt) {
        this._listeners = {};
        this._eventTypes = [];
        this.__scope__ = this;
        if(opt){
            if(opt.eventTypes){
                this.eventTypes(opt.eventTypes);
            }
            if(opt.listeners){
                this.on(opt.listeners);
            }
        }
    }

    eventTypes() {
        Array.prototype.forEach.call(arguments, function(arg) {
            if (is.array(arg)) {
                arg.forEach(function(arg) {
                    if (is.string(arg) && this._eventTypes.indexOf(arg) === -1) {
                        this._eventTypes.push(arg);
                    }
                }.bind(this));
            } else if (is.string(arg) && this._eventTypes.indexOf(arg) === -1) {
                this._eventTypes.push(arg);
            }
        }.bind(this));
        return this._eventTypes;
    }

    on(evt, callback) {
        if (arguments.length === 1) {
            if (is.array(evt)) {
                evt.forEach(function(evt) {
                    this.on(evt.type, evt.handler);
                }.bind(this));
            } else if (is.hash(evt)) {
                Object.keys(evt).forEach(function(type) {
                    let handler = evt[type];
                    if (is.fn(handler)) {
                        this.on(type, handler);
                    } else if (is.array(handler)) {
                        handler.forEach(function(h) {
                            if (is.fn(h)) {
                                this.on(type, h);
                            } else {
                                console.warn('Invalid event handler', type, h);
                            }
                        }.bind(this));
                    } else {
                        console.warn('Invalid event handler', type, handler);
                    }
                }.bind(this));
            } else {
                console.warn('Invalid param', arguments);
            }
        } else if (is.string(evt) && is.fn(callback)) {
            if (this._eventTypes.indexOf(evt) === -1) {
                console.warn('Invalid event name', arguments);
            } else {
                if (!is.array(this._listeners[evt])) {
                    this._listeners[evt] = [];
                }
                let idx = this._listeners[evt].indexOf(callback);
                if (idx === -1) {
                    this._listeners[evt].push(callback);
                }
            }
        } else {
            console.warn('Invalid param', arguments);
        }
    }

    un(evtname, callback) {
        let handlers = this._listeners[evtname],
            idx;
        if (is.array(handlers) && (idx = handlers.indexOf(callback) !== -1)) {
            handlers.splice(idx, 1);
        }
    }

    hasListener(evtname, callback){
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
