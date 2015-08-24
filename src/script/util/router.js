let Util = require('./core'),
  {is} = Util;
class Router {
  constructor() {
    this.routes = {};
    this.prefix = '';
  }
}

module.exports = Router;
