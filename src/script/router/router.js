let Util = require('../util/util'),
  Event = require('../event/event'),
  {is, dom} = Util;
class RootRouter extends Event {
  constructor() {
    super();
    this.events = {};
    this.routes = [];
    this.optionalParam = new RegExp('\\((.*?)\\)', 'g');
    this.namedParam = new RegExp('(\\(\\?)?:\\w+', 'g');
    this.escapeRegExp = new RegExp('[\\-{}\\[\\]+?.,\\\\\\^$|#\\s]', 'g');
    dom.on(this.dispatch.bind(this));
  }
  statechange() {
    let State = History.getState();
    this.route(State.url);
  }
  getPath(url) {
    this.a.href = url;
    let path = this.a.pathname + this.a.search + this.a.hash;
    path = path.match('#')
      ? path.split('#')[1]
      : path;
    return path.match(/^\//) ? path : '/' + path;
  }
  route() {
    let path = this.getPath(url);
    Object.keys(this._routes).forEach()
    for (var i in this.routes) {
      var matches = self.routes[i].regex.exec(path);
      self.routes[i].regex.lastIndex = 0;
      if (matches !== null) {
        if (matches.length > 1) {
          matches.shift();
          self.routes[i].callback.apply(null, matches);
        } else {
          self.routes[i].callback();
        }
        break;
      }
    }
  }
  back() {
    History.back();
  }
  go(url) {
    if (url === parseInt(url)) {
      History.go(url);
    } else {
      History.pushState(null, null, url);
    }
  }
}

module.exports = RootRouter;
