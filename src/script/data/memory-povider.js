let Povider = require('./povider');
class MemoryPovider extends Povider {
  constructor(data) {
    super({});
    this.data = data;
  }
  _getData(success, fail, progress) {
    success(this.data);
  }
}
module.exports = MemoryPovider;
