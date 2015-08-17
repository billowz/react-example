let React = require('react'),
  {watch, is} = require("./util/util"),
  DataPovider = require('./data/povider'),
  {PropTypes} = React,
  comps = {};
let Compontent = function(name, option) {
  if (comps[name]) {
    throw new Error('Compontent named[${name}] is defined.');
  }
  option.displayName = name;
  option.getCompontentName = function() {
    return name;
  };
  option.mixins = [Compontent.Mixins].concat(option.mixins || []);
  comps[name] = React.createClass(option);
  return comps[name];
}
Compontent.getCompontent = function(name) {
  return comps[name];
}
Compontent.getCompontentNames = function(reg) {
  if (reg) {
    reg = new RegExp(reg);
  }
  let names = [];
  for (let name in comps) {
    if (comps.hasOwnProperty(name) && comps[name]) {
      if (reg && !reg.test(name)) {
        continue;
      }
      names.push(name);
    }
  }
  return names;
}

function _parseCompontent(cfg, idx, handler) {
  let Comp = cfg.type, dom, fdom,
    props = cfg.option || {};
  if (is.string(Comp)) {
    Comp = Compontent.getCompontent(cfg.type);
  }
  dom = (<Comp {...props} compontents={cfg.children} dataPovider={cfg.dataPovider} key={idx} ref={idx}></Comp>);
  if (is.fn(handler)) {
    fdom = handler.apply(this, [cfg, dom, idx]);
    if (fdom != undefined) {
      dom = fdom;
    }
  }
  return dom;
}

Compontent.renderCompontent = function(cfg, handler) {
  return _parseCompontent(cfg, 0, handler);
}
Compontent.renderCompontents = function renderCompontents(cfgs, key, handler) {
  if (is.fn(key)) {
    handler = key;
    key = null;
  }
  if (Array.isArray(cfgs)) {
    return cfgs.filter(function(cfg) {
      return is.hash(cfg);
    }).map(function(cfg, idx) {
      return _parseCompontent(cfg, idx, handler);
    });
  } else if (is.hash(cfgs)) {
    return _parseCompontent(cfgs, 0, handler);
  } else {
    throw new Error('Invalid param 0, need object or array', cfg);
  }
}
Compontent.Mixins = {
  propTypes: {
    compontents: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    dataPovider: PropTypes.instanceOf(DataPovider)
  },
  getInitialState() {
    if (this.props.dataPovider) {
      this.props.dataPovider.subscribe(function(data) {
        this.setState({
          data: data
        });
      }.bind(this), function(updated) {}.bind(this), function() {
        this.console.error(arrguments);
      });
    }
    return {
      data: null
    };
  },
  componentWillUnmount() {
    //this.__unwatchCompontents();
  },
  __watchCompontents() {
    let self = this;
    if (!this.__compontentsWatchHandler) {
      this.__compontentsWatchHandler = function(prop, func, val, oldVal) {
        console.log(self.getCompontentName(), self, this, arguments);
        self.forceUpdate();
      }
    } else {
      this.__unwatchCompontents();
    }
    watch.watch(this.props, 'compontents', this.__compontentsWatchHandler);
  },
  __unwatchCompontents() {
    if (this.__compontentsWatchHandler) {
      watch.unwatch(this.props, 'compontents', this.__compontentsWatchHandler);
    }
  },
  renderCompontents() {
    // reset this.props.compontents
    // change compontents
    //this.__watchCompontents();
    return Compontent.renderCompontents(this.props.compontents, this.compontentHandler);
  },
  getCompontent(idx) {
    return this.refs[idx];
  }
}
module.exports = Compontent;
