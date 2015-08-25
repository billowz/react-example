let Util = require('./core'),
  {is} = Util;
class Router {
  constructor(parent) {
    this.parent = parent;

    this.routes = {};
    this.prefix = '';
  }
}

module.exports = Router;
