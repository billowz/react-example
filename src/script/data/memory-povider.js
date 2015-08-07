let Povider = require('./povider');
class MemoryPovider extends Povider{
    constructor(data){
        super();
        this.data = data;
    }
    _getData(def){
        def.resolve(this.data);
    }

}
module.exports = MemoryPovider;
