let is = require('is');
function clsReg(cls) {
  return new RegExp('(\\s|^)' + cls + '(\\s|$)');
}
function checkEl(el) {
  if (!is.element(el)) {
    throw 'Invalid Element ' + el;
  }
}
let Dom = {
  on(el, evt, callback) {
    checkEl(el);
    callback = function(event) {
      if (!event) {
        event = window.event;
      }
      callback(event);
    }
    if (el.addEventListener) {
      el.addEventListener(evt, callback, false);
      return {
        remove() {
          el.removeEventListener(evt, callback, false);
        }
      };
    } else if (el.attachEvent) {
      el.attachEvent('on' + evt, callback);
      return {
        remove() {
          el.detachEvent('on' + evt, callback);
        }
      };
    }
  },
  css(el, attr, value) {
    checkEl(el);
    if (arguments.length === 2) {
      if(is.hash(attr)){
        Object.keys(attr).forEach(function(att){
          Dom.css(el, att, attr[att]);
        });
      }else if(is.string(attr)){
        return el.style[attr];
      }
    } else if (arguments.length === 3) {
      el.style[attr] = value;
    }
  },
  hasCls(el, cls) {
    checkEl(el);
    if (is.array(cls)) {
      return cls.filter(function(c) {
          return Dom.hasCls(el, c);
        }).length > 0;
    }
    if (!is.string(cls)) {
      throw 'Invalid ClassName'
    }
    return el.className.match(clsReg(cls));
  },
  addCls(el, cls) {
    checkEl(el);
    if (is.array(cls)) {
      cls.forEach(function(c) {
        Dom.addCls(el, c);
      }).length > 0;
    } else if (is.string(cls) && !Dom.hasCls(el, cls)) {
      el.className += " " + cls;
    }
  },
  removeCls(el, cls) {
    checkEl(el);
    if (is.array(cls)) {
      cls.forEach(function(c) {
        Dom.removeCls(el, c);
      }).length > 0;
    } else if (is.string(cls) && Dom.hasCls(el, cls)) {
      el.className = el.className.replace(clsReg(cls), ' ');
    }
  },
  toggleClass(el, cls) {
    if(Dom.hasCls(el, cls)){
      Dom.removeCls(cls);
    }else{
      Dom.addCls(cls);
    }
  }
}
module.exports = Dom;
