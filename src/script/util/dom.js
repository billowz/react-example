let is = require('is'),
  Util = require('./core');
function clsReg(cls) {
  return new RegExp('(\\s+|^)' + cls + '(\\s+|$)');
}
function checkEl(el) {
  if (!is.element(el)) {
    throw 'Invalid Element ' + el;
  }
}
function checkHtml(el){
  if (!is.element(el) && !(el instanceof Document) && !(el instanceof Window)) {
    throw 'Invalid Element ' + el;
  }
}
let Dom = {
  on(el, evt, callback) {
    checkHtml(el);
    if (el.addEventListener) {
      el.addEventListener(evt, callback, false);
    } else if (el.attachEvent) {
      el.attachEvent('on' + evt, callback);
    }
  },
  un(el, evt, callback) {
    checkHtml(el);
    if (el.addEventListener) {
      el.removeEventListener(evt, callback, false);
    } else if (el.attachEvent) {
      el.detachEvent('on' + evt, callback);
    }
  },
  css(el, attr, value) {
    checkEl(el);
    if (arguments.length === 2) {
      if (is.hash(attr)) {
        Object.keys(attr).forEach(function(att) {
          el.style[att] = attr[att];
        });
      } else if (is.string(attr)) {
        return el.currentStyle ? el.currentStyle[attr] : getComputedStyle(el, null)[attr];
      }
    } else if (arguments.length === 3) {
      el.style[attr] = value;
    }
  },
  cleanInnerCss(el, ...attrNames) {
    checkEl(el);
    if (arguments.length == 2) {
      attrNames = attrNames[0];
    }
    if (is.array(attrNames)) {
      attrNames.forEach(function(attr) {
        el.style[attr] = undefined;
      });
    } else if (is.string(attrNames)) {
      el.style[attrNames] = undefined;
    } else {
      throw 'Invalid Css Name';
    }
  },
  hasCls(el, ...cls) {
    checkEl(el);
    if (arguments.length == 2) {
      cls = cls[0];
    }
    if (is.array(cls)) {
      let clsNames = el.className;
      for (let i = 0; i < cls.length; i++) {
        if (clsNames.match(clsReg(cls.trim()))) {
          return true;
        }
      }
      return false;
    } else if (is.string(cls)) {
      return el.className.match(clsReg(cls.trim()));
    } else {
      throw 'Invalid ClassName'
    }
  },
  addCls(el, ...cls) {
    checkEl(el);
    if (arguments.length == 2) {
      cls = cls[0];
    }
    let clss = el.className ? el.className.split(/\s+/g) : [];
    Util.pushDistinctArray(clss, cls);
    el.className = clss.join(' ');
  },
  removeCls(el, ...cls) {
    checkEl(el);
    if (arguments.length == 2) {
      cls = cls[0];
    }
    if (el.className) {
      let clss = el.className.split(/\s+/g);
      Util.removeArrayValues(clss, cls);
      el.className = clss.join(' ');
    }
  },
  toggleClass(el, cls) {
    if (Dom.hasCls(el, cls)) {
      Dom.removeCls(el, cls);
    } else {
      Dom.addCls(el, cls);
    }
  }
}
module.exports = Dom;
