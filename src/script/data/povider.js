let Util = require('../util/util');
let Event = require('../event/event');
let is = require('is');

class DataPovider extends Event{
    constructor(){
        super();
        this.eventTypes('progress', 'update');
    }
    _getData(def){
        throw 'abstract method';
    }
    getData(success, fail, progress){
        let pomise = Util.promise(function(def){
            return this._getData(def);
        }.bind(this));
        if(is.fn(success)){
            pomise.then(success);
        }
        if(is.fn(fail)){
            pomise.fail(fail);
        }
        if(is.fn(progress)){
            pomise.progress(progress);
        }
        return pomise;
    }

}

module.exports = DataPovider;
