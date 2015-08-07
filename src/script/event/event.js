let is = require('is');
class Event {
    constructor(eventTypes) {
        this._listeners = {};
        this._eventTypes = [];
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
    on(evt, callback){
        if(arguments.length === 1){
            if(is.array(evt)){
                evt.forEach(function(evt){
                    this.on(evt.type, evt.handler);
                }.bind(this));
            }else if(is.hash(evt)){
                Object.keys(evt).forEach(function(type){
                    let handler = evt[type];
                    if(is.func(handler)){
                        this.on(type, handler);
                    }else if(is.array(handler)){
                        handler.forEach(function(h){
                            if(is.func(h)){
                                this.on(type, h);
                            }else{
                                console.warn('Invalid event handler', type, h);
                            }
                        }.bind(this));
                    }else{
                        console.warn('Invalid event handler', type, handler);
                    }
                }.bind(this));
            }else{
                console.warn('Invalid param', arguments);
            }
        }else if(is.string(evt) && is.func(callback)){
            if(this._eventTypes.indexOf(evt) === -1){
                console.warn('Invalid event name', arguments);
            }else{
                if(!is.array(this._listeners[evt])){
                    this._listeners[evt] = [];
                }
                this._listeners[evt].push(callback);
            }
        }else{
            console.warn('Invalid param', arguments);
        }
    }
    fire(evtname, ...args){
        console.log(args)
    }
}
module.exports = Event;
